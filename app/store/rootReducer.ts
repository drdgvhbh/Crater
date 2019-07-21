import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { anchorReducer } from './anchor';
import { horizonReducer } from './horizon';
import { walletReducer } from './state';

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    wallet: walletReducer,
    anchors: anchorReducer,
    horizon: horizonReducer,
  });
