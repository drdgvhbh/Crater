import produce from 'immer';
import { OperationType } from 'stellar-sdk';
import * as fromActions from './actions';

export type OperationTypeState = OperationType | 'unset';
export interface Operation {
  sourceAccount?: string;
  name?: string;
  type: OperationTypeState;
  value?: string | Buffer;
}

export const initialState = {
  sourceAccount: '',
  sequenceNumber: 0,
  operations: [] as Operation[],
};
const reducer = (state = initialState, action: fromActions.Actions) =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_SIGNING_TXN_OPS:
        draft.operations.length = 0;
        draft.operations.push(...action.payload);
        break;
      case fromActions.SET_SIGNING_TXN_SOURCE_ACCOUNT:
        draft.sourceAccount = action.payload;
      case fromActions.SET_SIGNING_TXN_SEQUENCE_NUMBER:
        draft.sequenceNumber = Number(action.payload);
      default:
        break;
    }
  });

export default reducer;
