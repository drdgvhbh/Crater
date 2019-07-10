import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Operation } from './reducer';

export const DO_NOTHING = 'DO_NOTHING';
export const SET_SIGNING_TXN_OPS = 'SET_SIGNING_TXN_OPS';

export const Actions = {
  doNothing: () => createAction(DO_NOTHING),
  setSigningTransactionOperations: (operations: Operation[]) =>
    createAction(SET_SIGNING_TXN_OPS, operations),
};

export type Actions = ActionsUnion<typeof Actions>;
