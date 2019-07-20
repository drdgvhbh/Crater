import { ofType } from '@martin_hotell/rex-tils';
import debug from 'debug';
import moment from 'moment';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { concat, of } from 'rxjs';
import { flatMap, withLatestFrom } from 'rxjs/operators';
import { Keypair, OperationType } from 'stellar-sdk';
import { RootState } from '../../../configureStore';
import * as rootActions from '../actions';
import * as fromActions from './actions';
import { Operation } from './reducer';

export const transactionEpic = (
  action$: ActionsObservable<rootActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(rootActions.START_SIGN_TRANSACTION_FLOW),
    withLatestFrom(state$),
    flatMap(([action]) => {
      const tx = action.payload;
      const ops: Operation[] = tx.operations.map((op) => {
        switch (op.type) {
          case 'manageData':
            return {
              sourceAccount: op.source,
              name: op.name,
              type: op.type as OperationType.ManageData,
              value: op.value,
            };
          default:
            throw new Error('not implemented');
        }
      });

      const {
        payload: { source, sequence, memo, fee, timeBounds, signatures },
      } = action;

      return of(
        fromActions.Actions.setSignatureTxnDetails({
          sourceAccount: source,
          sequenceNumber: Number(sequence),
          memo: memo.value ? memo.value.toString() : '',
          fee,
          timebounds: [
            moment.unix(Number(timeBounds.minTime)),
            moment.unix(Number(timeBounds.maxTime)),
          ],
          operations: ops,
          signatures: signatures.map((sig) => {
            const sourceAccountKP = Keypair.fromPublicKey(source);
            if (sourceAccountKP.verify(tx.hash(), sig.signature())) {
              return {
                hint: sourceAccountKP.publicKey(),
                value: sig.signature().toString('base64'),
              };
            }
            const partialPublicKey = Buffer.concat([
              Buffer.alloc(28, 0),
              sig.hint(),
            ]);
            const keypair = new Keypair({
              type: 'ed25519',
              publicKey: partialPublicKey.toString(),
            });
            debug('app:')(keypair.publicKey());
            const partialPublicKeyString =
              'G' +
              new Buffer(46).fill('_').toString() +
              keypair.publicKey().substr(47, 5) +
              new Buffer(4).fill('_').toString();

            return {
              hint: partialPublicKeyString,
              value: sig.signature().toString('base64'),
            };
          }),
        }),
      );
    }),
  );

export default combineEpics(transactionEpic);
