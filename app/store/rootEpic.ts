import { combineEpics } from 'redux-observable';
import { walletEpics } from './state';
import { anchorEpics } from './state/anchor';

export const rootEpic = combineEpics(walletEpics, anchorEpics);
