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
  operations: [] as Operation[],
};
const reducer = (state = initialState, action: fromActions.Actions) =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_SIGNATURE_OPERATIONS:
        draft.operations.length = 0;
        draft.operations.push(...action.payload);
        break;
      default:
        break;
    }
  });

export default reducer;
