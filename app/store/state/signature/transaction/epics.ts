import { ofType } from '@martin_hotell/rex-tils';
import moment from 'moment';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { concat, of } from 'rxjs';
import { flatMap, withLatestFrom } from 'rxjs/operators';
import { OperationType } from 'stellar-sdk';
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
        payload: { source, sequence, memo, fee, timeBounds },
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
        }),
      );
    }),
  );

export default combineEpics(transactionEpic);
