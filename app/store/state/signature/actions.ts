import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Transaction } from 'stellar-sdk';

export const DO_NOTHING = 'DO_NOTHING';
export const START_SIGN_TRANSACTION_FLOW = 'START_SIGN_TRANSACTION_FLOW';

export const Actions = {
  doNothing: () => createAction(DO_NOTHING),
  startSignTransactionFlow: (transaction: Transaction) =>
    createAction(START_SIGN_TRANSACTION_FLOW, transaction),
};

export type Actions = ActionsUnion<typeof Actions>;
