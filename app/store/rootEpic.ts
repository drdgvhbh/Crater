import { combineEpics } from 'redux-observable';
import { walletEpics } from './state';

export const rootEpic = combineEpics(walletEpics);
