import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { walletReducer } from './state';
import { anchorReducer } from './state/anchor';

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    wallet: walletReducer,
    anchors: anchorReducer,
  });
