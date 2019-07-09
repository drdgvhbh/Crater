import * as fromActions from './actions';
import { reducer as transactionReducer } from './transaction';

enum CurrentOperation {
  NOT_SIGNING = 'NOT_SIGNING',
  SIGNING_TRANSACTION = 'SIGNING_TRANSACTION',
}

export const initialState = {
  currentOperation: CurrentOperation.NOT_SIGNING as CurrentOperation,
  transaction: transactionReducer(undefined, {} as any),
  txnEnvXDR:
    'AAAAAPVD0Thc3O8AwdpiXqpOCHEpXOtoYrU0578LwCpUIGM8AAAAZAAAAAAAAAABAAAAAQAAAABdJAAdAAAAAF0kAUkAAAAAAAAAAQAAAAEAAAAAdV2iRRpbBLR3/Xjf+xxG0JLMVClrKtmUox/sjbp7bbsAAAAKAAAAFlN0ZWxsYXIgRkkgQW5jaG9yIGF1dGgAAAAAAAEAAABAX3BkamJKcXRhSjZ6ei1tRTdPVkZBWFVlendfWXhPcjZxc2YyUVFHSE9jZjFUcjI4WUsta19EaThrU0pFZzFRSwAAAAAAAAABVCBjPAAAAEDYa1Y93Xoc4zS9eKowf2OChoBR0lOcFsY/tKvUzLvpCRKwW97iMJQ+X72+uE3TYduibzuYdXEUJagJeHHH+pkL',
  //  'AAAAAP%2Byw%2BZEuNg533pUmwlYxfrq6%2FBoMJqiJ8vuQhf6rHWmAAAAZAB8NHAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAA%2F7LD5kS42DnfelSbCVjF%2Burr8GgwmqIny%2B5CF%2FqsdaYAAAAAAAAAAACYloAAAAAAAAAAAA',
};
export type State = typeof initialState;

export const reducer = (state = initialState, action: fromActions.Actions) => {
  return {
    ...state,
    transaction: transactionReducer(state.transaction, action as any),
  };
};
