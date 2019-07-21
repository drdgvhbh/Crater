import produce from 'immer';
import * as fromActions from './actions';

export interface BalanceLineLumens {
  balance: string;
  buyingLiabilities: string;
  sellingLiabilities: string;
}

export interface BalanceLineAsset {
  balance: string;
  limit: string;
  type: string;
  issuer: string;
  buyingLiabilities: string;
  sellingLiabilities: string;
}

const initialState = {
  lumens: {
    balance: '0',
    buyingLiabilities: '0',
    sellingLiabilities: '0',
  } as BalanceLineLumens,
  assets: [] as BalanceLineAsset[],
};

export const reducer = (state = initialState, action: fromActions.Actions) =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_BALANCE_LINE_LUMENS:
        draft.lumens = action.payload.balanceLine;
        break;
      case fromActions.SET_BALANCE_LINE_ASSETS:
        draft.assets = [];
        draft.assets.push(...action.payload.balanceLine);
        break;
      default:
        break;
    }
  });
