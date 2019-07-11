import * as fromActions from './actions';
import { reducer as transactionReducer } from './transaction';

enum CurrentOperation {
  NOT_SIGNING = 'NOT_SIGNING',
  SIGNING_TRANSACTION = 'SIGNING_TRANSACTION',
}

export const initialState = {
  currentOperation: CurrentOperation.NOT_SIGNING as CurrentOperation,
  transaction: transactionReducer(undefined, {} as any),
};
export type State = typeof initialState;

export const reducer = (state = initialState, action: fromActions.Actions) => {
  return {
    ...state,
    transaction: transactionReducer(state.transaction, action as any),
  };
};
