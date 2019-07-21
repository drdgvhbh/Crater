import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { BalanceLineAsset, BalanceLineLumens } from './reducer';

export const SET_BALANCE_LINE_LUMENS = 'SET_BALANCE_LINE_LUMENS';
export const SET_BALANCE_LINE_ASSETS = 'SET_BALANCE_LINE_ASSETS';

export interface SetBalanceLineLumensParams {
  balanceLine: BalanceLineLumens;
}

export interface SetBalanceLineAssetsParams {
  balanceLine: BalanceLineAsset[];
}

export const Actions = {
  setBalanceLineLumens: (params: SetBalanceLineLumensParams) =>
    createAction(SET_BALANCE_LINE_LUMENS, params),
  setBalanceLineAssets: (params: SetBalanceLineAssetsParams) =>
    createAction(SET_BALANCE_LINE_ASSETS, params),
};

export type Actions = ActionsUnion<typeof Actions>;
