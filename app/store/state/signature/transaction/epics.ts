import { ofType } from '@martin_hotell/rex-tils';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { of } from 'rxjs';
import { concat, flatMap, withLatestFrom } from 'rxjs/operators';
import { RootState } from '../../../configureStore';
import * as rootActions from '../actions';
import * as fromActions from './actions';
import { Operation, OperationTypeState } from './reducer';

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
              type: op.type as OperationTypeState,
              value: op.value,
            };
          default:
            throw new Error('not implemented');
        }
      });
      return of(fromActions.Actions.setSigningTransactionOperations(ops));
    }),
  );

export default combineEpics(transactionEpic);
