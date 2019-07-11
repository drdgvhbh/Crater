import produce from 'immer';
import moment from 'moment';
import { OperationType } from 'stellar-sdk';
import * as fromActions from './actions';

export type OperationTypeState = OperationType | 'unset';

export interface ManageDataOperation {
  type: OperationType.ManageData;
  sourceAccount: string;
  name: string;
  value: string | Buffer;
}

export type Operation = ManageDataOperation;

export interface PendingTransaction {
  readonly sourceAccount: string;
  readonly sequenceNumber: number;
  readonly memo: string;
  readonly fee: number;
  readonly timebounds: [string, string];
  readonly operations: Operation[];
}

export const initialState: PendingTransaction = {
  sourceAccount: '',
  sequenceNumber: 0,
  memo: '',
  fee: 0,
  timebounds: [moment.unix(0).toISOString(), moment.unix(0).toISOString()],
  operations: [],
};
const reducer = (state = initialState, action: fromActions.Actions) =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_SIGNING_TXN_DETAILS:
        draft.operations.length = 0;
        draft.operations.push(...action.payload.operations);
        draft.sourceAccount = action.payload.sourceAccount;
        draft.sequenceNumber = action.payload.sequenceNumber;
        const { timebounds } = action.payload;
        draft.timebounds[0] = timebounds[0].toISOString();
        draft.timebounds[1] = timebounds[1].toISOString();
        draft.fee = action.payload.fee;
        if (action.payload.memo) {
          draft.memo = action.payload.memo;
        }
        break;
      default:
        break;
    }
  });

export default reducer;
