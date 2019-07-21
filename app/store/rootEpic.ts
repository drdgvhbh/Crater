import { combineEpics } from 'redux-observable';
import { anchorEpics } from './anchor';
import { networkEpics } from './network';
import { walletEpics } from './state';

export const rootEpic = combineEpics(walletEpics, anchorEpics, networkEpics);
