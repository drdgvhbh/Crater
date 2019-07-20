import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';

export const SET_HORIZON_SERVER_URL = 'SET_HORIZON_SERVER_URL';

export interface SetHorizonServerURLParams {
  serverURL: string;
}

export const Actions = {
  setHorizonServerURL: (params: SetHorizonServerURLParams) =>
    createAction(SET_HORIZON_SERVER_URL, params),
};

export type Actions = ActionsUnion<typeof Actions>;
