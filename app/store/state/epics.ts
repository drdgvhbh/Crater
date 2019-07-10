import * as fromActions from './actions';

import { ofType } from '@martin_hotell/rex-tils';
import { push } from 'connected-react-router';
import electron from 'electron';
import keytar from 'keytar';
import queryString from 'query-string';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import {
  concat,
  defer,
  forkJoin,
  from,
  fromEventPattern,
  iif,
  of,
  pipe,
} from 'rxjs';
import { catchError, flatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import StellarHDWallet from 'stellar-hd-wallet';
import StellarSDK from 'stellar-sdk';
import { SimpleApi } from '../../third-party/coingecko';
import { isPaymentOperation } from '../../third-party/stellar';
import { RootState } from '../configureStore';
import { OperationRecords, TransactionRecord } from './reducer';
import {
  accountNumber as getAccountNumber,
  assetTypes as getAssetTypes,
  baseFee,
  mnemonic as getMnemonic,
  publicKey as getPublicKey,
} from './selectors';
import { epics as signatureEpics } from './signature';

const stellarServer = new StellarSDK.Server(
  'https://horizon-testnet.stellar.org',
);
StellarSDK.Network.useTestNetwork();

const MNEMONIC_KEY = 'mnemonic';

const simpleApi = new SimpleApi();

const LOAD_TRX_COUNT = 6;

export const loginEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  _state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.LOGIN),
    flatMap(({ payload: mnemonic }) =>
      of(fromActions.Actions.validateMnemonic(mnemonic)),
    ),
  );

export const validMnemonicEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  _state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.VALIDATE_MNEMONIC),
    flatMap(({ payload: mnemonic }) => {
      return of(mnemonic);
    }),
    flatMap((mnemonic) => {
      const actions: fromActions.Actions[] = [];
      if (!StellarHDWallet.validateMnemonic(mnemonic)) {
        actions.push(fromActions.Actions.validateMnemonicFailed());
      } else {
        actions.push(
          fromActions.Actions.addMnemonicToStorage(mnemonic),
          fromActions.Actions.validateMnemonicSucceeded(),
        );
      }
      actions.push(fromActions.Actions.setMnemonic(mnemonic));

      return concat(actions);
    }),
  );

export const validatedMnemonicSucceededEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  _state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.VALIDATE_MNEMONIC_SUCCEEDED),
    flatMap(() => {
      return of(push('/main'));
    }),
  );

export const addMnemonicToStorageEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  _state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.ADD_MNEMONIC_TO_STORAGE),
    flatMap(({ payload: mnemonic }) =>
      from(keytar.setPassword('crater', 'asdf', mnemonic)),
    ),
    flatMap(() => of(fromActions.Actions.addMnemonicToStorageSucceeded())),
    catchError(() => of(fromActions.Actions.addMnemonicToStorageFailed())),
  );

export const fetchPreexistingMnemonic = (
  action$: ActionsObservable<fromActions.Actions>,
  _state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.FETCH_PREEXISTING_MNEMONIC),
    flatMap(() => {
      return from(keytar.getPassword('crater', 'asdf')).pipe(
        flatMap((mnemonic) => {
          if (mnemonic) {
            return of(fromActions.Actions.validateMnemonic(mnemonic));
          }

          return of({ type: 'DO_NOTHING' });
        }),
      );
    }),
  );

export const setMnemonicEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.SET_MNEMONIC),
    withLatestFrom(state$),
    flatMap(([_, state]) => {
      const mnemonic = getMnemonic(state);
      const wallet = StellarHDWallet.fromMnemonic(mnemonic, undefined);

      return from(of(1)).pipe(
        map((data) => [0] as number[]),
        flatMap((savedAccounts) => {
          return forkJoin(
            savedAccounts.map((accountNumber) => {
              const publicKey = wallet.getPublicKey(accountNumber);
              return from(stellarServer.loadAccount(publicKey)).pipe(
                map(({ balances: assets }) =>
                  assets.map((asset) => ({
                    type:
                      asset.asset_type !== 'native' ? asset.asset_type : 'xlm',
                    amount: Number(asset.balance),
                  })),
                ),
                map((assets) => ({
                  accountNumber,
                  publicKey,
                  assets,
                })),
              );
            }),
          );
        }),
      );
    }),
    flatMap((data) =>
      concat([
        fromActions.Actions.setAccounts({ accounts: data }),
        fromActions.Actions.updateExchangeRates(),
        fromActions.Actions.loadTransactions({ count: LOAD_TRX_COUNT }),
      ]),
    ),
  );

export const updateExchangeRatesEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.UPDATE_EXCHANGE_RATES),
    withLatestFrom(state$),
    flatMap(([_, state]) => {
      const assetTypes = getAssetTypes(state);
      return forkJoin(
        assetTypes.map((assetType) => {
          const mappedAssetType = assetType !== 'xlm' ? assetType : 'stellar';

          return simpleApi
            .simplePriceGet({
              ids: mappedAssetType,
              vsCurrencies: 'usd',
            })
            .pipe(
              map(
                (pair) =>
                  [assetType, 'usd', pair[mappedAssetType].usd] as [
                    string,
                    string,
                    number,
                  ],
              ),
            );
        }),
      );
    }),
    map((data) => fromActions.Actions.setExchangeRates({ rates: data })),
  );

export const loadTransactionsEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.LOAD_TRANSACTIONS),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
      const publicKey = getPublicKey(state);

      return from(
        stellarServer
          .transactions()
          .forAccount(publicKey)
          .limit(action.payload.count)
          .order('desc')
          .call(),
      ).pipe(
        flatMap((collection) => of(collection.records)),
        flatMap((records) =>
          forkJoin(
            records.map((record) =>
              from(record.operations()).pipe(
                map((ops) => ops.records),
                map((opsRecords) =>
                  opsRecords.map((opRec) => {
                    if (isPaymentOperation(opRec)) {
                      const asset_type =
                        opRec.asset_type === 'native'
                          ? 'xlm'
                          : opRec.asset_type;
                      return { ...opRec, asset_type };
                    }

                    return { ...opRec };
                  }),
                ),
                map((ops) => ({
                  ...record,
                  operations: ops,
                })),
              ),
            ),
          ),
        ),
        flatMap((trxs) => {
          const operations: OperationRecords = {};
          const transactions: TransactionRecord[] = [];

          trxs.forEach((trx) => {
            const opIds: string[] = [];
            trx.operations.forEach((op) => {
              opIds.push(op.id);
              operations[op.id] = op;
            });
            transactions.push({
              ...trx,
              operations: opIds,
            });
          });

          return concat([
            fromActions.Actions.setTransactionOperations(operations),
            fromActions.Actions.setTransactions({
              publicKey: getPublicKey(state),
              transactions,
            }),
          ]);
        }),
      );
    }),
  );

export const loadBaseFeeEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.FETCH_BASE_FEE),
    withLatestFrom(state$),
    flatMap(([action, state]) =>
      from(stellarServer.fetchBaseFee()).pipe(
        flatMap((baseFee) => of(fromActions.Actions.setBaseFee(baseFee))),
      ),
    ),
  );

export const sendTransactionEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.SEND_TRANSACTION),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
      const fee = baseFee(state);
      const mnemonic = getMnemonic(state);
      const wallet = StellarHDWallet.fromMnemonic(mnemonic, undefined);
      const accountNumber = getAccountNumber(state);
      const keyPair = wallet.getKeypair(accountNumber);

      const {
        payload: { recipient, asset, memo },
      } = action;
      return from(stellarServer.loadAccount(keyPair.publicKey())).pipe(
        flatMap((account) => {
          const transactionBuilder = new StellarSDK.TransactionBuilder(
            account,
            {
              fee,
            },
          )
            .addOperation(
              StellarSDK.Operation.payment({
                destination: recipient,
                asset: StellarSDK.Asset.native(),
                // asset: new StellarSdk.Asset(asset.type, keyPair.publicKey()),
                amount: asset.amount.toString(),
              }),
            )
            .setTimeout(30);

          if (memo) {
            transactionBuilder.addMemo(StellarSDK.Memo.text(memo));
          }

          const transaction = transactionBuilder.build();
          const signingKeyPair = StellarSDK.Keypair.fromSecret(
            keyPair.secret(),
          );
          transaction.sign(signingKeyPair);

          return from(stellarServer.submitTransaction(transaction)).pipe(
            flatMap((result) =>
              of(fromActions.Actions.sendTransactionSucceeded(result)),
            ),
            catchError((err) =>
              of(fromActions.Actions.sendTransactionFailed(err)),
            ),
          );
        }),
      );
    }),
  );

export default combineEpics(
  loginEpic,
  validMnemonicEpic,
  validatedMnemonicSucceededEpic,
  addMnemonicToStorageEpic,
  fetchPreexistingMnemonic,
  setMnemonicEpic,
  updateExchangeRatesEpic,
  loadTransactionsEpic,
  loadBaseFeeEpic,
  sendTransactionEpic,
  signatureEpics,
);
