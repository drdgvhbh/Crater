import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { walletReducer } from './state';

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    wallet: walletReducer,
  });
