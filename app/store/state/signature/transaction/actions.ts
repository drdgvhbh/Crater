import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Operation } from './reducer';

export const DO_NOTHING = 'DO_NOTHING';
export const SET_SIGNATURE_OPERATIONS = 'SET_SIGNATURE_OPERATIONS';

export const Actions = {
  doNothing: () => createAction(DO_NOTHING),
  setSignatureOperations: (operations: Operation[]) =>
    createAction(SET_SIGNATURE_OPERATIONS, operations),
};

export type Actions = ActionsUnion<typeof Actions>;
