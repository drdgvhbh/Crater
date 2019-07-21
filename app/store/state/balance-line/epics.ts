import { RootState } from '@/store/configureStore';
import { ofType } from '@martin_hotell/rex-tils';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { from, of } from 'rxjs';
import { concat, concatMap, flatMap, withLatestFrom } from 'rxjs/operators';
import { horizonServer as getHorizonServer } from '../../selectors';
import * as parentActions from '../actions';
import * as fromActions from './actions';
import { BalanceLineAsset, BalanceLineLumens } from './reducer';

export const loadAssetsEpic = (
  action$: ActionsObservable<parentActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(parentActions.SET_ACCOUNT_NUMBER),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
      const { hdWallet, accountNumber } = action.payload;
      const pk = hdWallet.getPublicKey(accountNumber);
      const horizonServer = getHorizonServer(state);

      return from(horizonServer.loadAccount(pk)).pipe(
        concatMap(({ balances }) => {
          let lumens: BalanceLineLumens;
          const assets: BalanceLineAsset[] = [];

          balances
            .map((balance) => ({
              ...balance,
              buyingLiabilities: balance.buying_liabilities,
              sellingLiabilities: balance.selling_liabilities,
              buying_liabilities: undefined,
              selling_liabilities: undefined,
            }))
            .forEach((balance) => {
              switch (balance.asset_type) {
                case 'native':
                  lumens = {
                    balance: balance.balance,
                    buyingLiabilities: balance.buyingLiabilities,
                    sellingLiabilities: balance.sellingLiabilities,
                  };
                  break;
                case 'credit_alphanum4' || 'credit_alphanum12':
                  assets.push({
                    balance: balance.balance,
                    limit: balance.limit,
                    buyingLiabilities: balance.buyingLiabilities,
                    sellingLiabilities: balance.sellingLiabilities,
                    type: balance.asset_type,
                    issuer: balance.asset_issuer,
                  });
                  break;
                default:
                  break;
              }
            });

          return of(
            fromActions.Actions.setBalanceLineLumens({
              balanceLine: lumens,
            }),

            fromActions.Actions.setBalanceLineAssets({
              balanceLine: assets,
            }),
          );
        }),
      );
    }),
  );

export default combineEpics(loadAssetsEpic);
