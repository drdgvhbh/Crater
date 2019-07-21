import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';

export const ADD_ANCHOR = 'ADD_ANCHOR';
export const SET_ANCHOR_ACCESS_TOKEN = 'SET_ANCHOR_ACCESS_TOKEN';
export const WEB_AUTHENTICATION_FAILED = 'WEB_AUTHENTICATION_FAILED';

export interface AddAnchorParams {
  anchorURL: string;
}

export interface SetAnchorAccessTokenParams {
  anchorSigningKey: string;
  token: string;
}

export const Actions = {
  addAnchor: (params: AddAnchorParams) => createAction(ADD_ANCHOR, params),
  setAnchorAccessToken: (params: SetAnchorAccessTokenParams) =>
    createAction(SET_ANCHOR_ACCESS_TOKEN, params),
  webAuthenticationFailed: () => createAction(WEB_AUTHENTICATION_FAILED),
};

export type Actions = ActionsUnion<typeof Actions>;
