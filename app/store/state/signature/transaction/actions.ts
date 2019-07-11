import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Moment } from 'moment';
import { Operation } from './reducer';

export const DO_NOTHING = 'DO_NOTHING';
export const SET_SIGNING_TXN_DETAILS = 'SET_TXN_DETAILS';

export interface SetSignatureTxnDetailsParams {
  readonly sourceAccount: string;
  readonly sequenceNumber: number;
  readonly memo?: string;
  readonly fee: number;
  readonly timebounds: [Moment, Moment];
  readonly operations: Operation[];
}

export const Actions = {
  doNothing: () => createAction(DO_NOTHING),
  setSignatureTxnDetails: (payload: SetSignatureTxnDetailsParams) =>
    createAction(SET_SIGNING_TXN_DETAILS, payload),
};

export type Actions = ActionsUnion<typeof Actions>;
