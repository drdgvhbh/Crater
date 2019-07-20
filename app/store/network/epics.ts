import { ofType } from '@martin_hotell/rex-tils';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { ignoreElements, tap } from 'rxjs/operators';
import StellarSDK from 'stellar-sdk';
import { RootState } from '../configureStore';
import * as fromActions from './actions';

const testNetworkEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  _state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(fromActions.USE_TESTNET),
    tap(() => StellarSDK.Network.useTestNetwork()),
    ignoreElements(),
  );

export default combineEpics(testNetworkEpic);
