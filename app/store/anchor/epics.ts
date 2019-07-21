import {
  TransactionChallengeVerificationError,
  verify as verifyChallengeTransaction,
} from '@/modules/sep10-challenge';
import { authenticateClientSide } from '@/modules/sep10-web-authentication';
import { RootState } from '@/store/configureStore';
import { ofType } from '@martin_hotell/rex-tils';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { from, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, flatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import StellarHDWallet from 'stellar-hd-wallet';
import { Keypair, StellarTomlResolver, Transaction } from 'stellar-sdk';
import url from 'url';
import {
  accountNumber,
  mnemonic as getMnemonic,
  publicKey,
  signingKeypair,
} from '../selectors';
import * as fromActions from './actions';

interface StellarTOML {
  AUTH_SERVER: string;
  SIGNING_KEY: string;
  [key: string]: any;
}

const addAnchorEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<RootState>,
) => {
  const debugPrint = debug('app:addAnchorEpic');
  const debugPrintErr = debugPrint.extend('error');
  return action$.pipe(
    ofType(fromActions.ADD_ANCHOR),
    tap(({ payload: { anchorURL } }) =>
      debugPrint('connecting to anchor', anchorURL),
    ),
    flatMap(({ payload: { anchorURL } }) => {
      return from(
        StellarTomlResolver.resolve(anchorURL, { allowHttp: true }),
      ).pipe(
        map((stellarTOML) => stellarTOML as StellarTOML),
        withLatestFrom(state$),
        flatMap(([stellarTOML, state]) => {
          const authServerURL = new url.URL('', stellarTOML.AUTH_SERVER);
          const pubKey = publicKey(state);
          authServerURL.searchParams.append('account', pubKey);

          return of([authServerURL, stellarTOML.SIGNING_KEY] as [
            url.URL,
            string,
          ]);
        }),
        withLatestFrom(state$),
        flatMap(([[authServerURL, SIGNING_KEY], state]) =>
          authenticateClientSide(
            authServerURL,
            signingKeypair(state),
            SIGNING_KEY,
            { allowInsecure: true },
          ).pipe(
            flatMap((token) =>
              of(
                fromActions.Actions.setAnchorAccessToken({
                  token,
                  anchorSigningKey: SIGNING_KEY,
                }),
              ),
            ),
            catchError((err) =>
              of(fromActions.Actions.webAuthenticationFailed()).pipe(
                tap(() => {
                  debugPrintErr('web authentication failed', err);
                  if (err.name === TransactionChallengeVerificationError.name) {
                    debugPrintErr(
                      'transaction challenge verification error',
                      (err as TransactionChallengeVerificationError).type,
                    );
                  }
                }),
              ),
            ),
          ),
        ),
      );
    }),
  );
};

export default combineEpics(addAnchorEpic);
