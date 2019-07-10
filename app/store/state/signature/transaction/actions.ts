import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Operation } from './reducer';

export const DO_NOTHING = 'DO_NOTHING';
export const SET_SIGNING_TXN_OPS = 'SET_SIGNING_TXN_OPS';
export const SET_SIGNING_TXN_SOURCE_ACCOUNT = 'SET_SIGNING_TXN_SOURCE_ACT';
export const SET_SIGNING_TXN_SEQUENCE_NUMBER =
  'SET_SIGNING_TXN_SEQUENCE_NUMBER';

export const Actions = {
  doNothing: () => createAction(DO_NOTHING),
  setSigningTransactionOperations: (operations: Operation[]) =>
    createAction(SET_SIGNING_TXN_OPS, operations),
  setSigningTxnSourceAct: (sourceAccount: string) =>
    createAction(SET_SIGNING_TXN_SOURCE_ACCOUNT, sourceAccount),
  setSigningTxnSequenceNumber: (sequenceNumber: number) =>
    createAction(SET_SIGNING_TXN_SEQUENCE_NUMBER, sequenceNumber),
};

export type Actions = ActionsUnion<typeof Actions>;
