import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Transaction } from 'stellar-sdk';

export const DO_NOTHING = 'DO_NOTHING';
export const EMIT_SIGN_TRANSACTION_OPERATION =
  'EMIT_SIGN_TRANSACTION_OPERATION';

export const Actions = {
  doNothing: () => createAction(DO_NOTHING),
  emitSignTransactionOperation: (transaction: Transaction) =>
    createAction(EMIT_SIGN_TRANSACTION_OPERATION, transaction),
};

export type Actions = ActionsUnion<typeof Actions>;
