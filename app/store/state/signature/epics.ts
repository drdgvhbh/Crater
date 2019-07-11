import { ofType } from '@martin_hotell/rex-tils';
import debug from 'debug';
import electron from 'electron';
import queryString from 'query-string';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { defer, fromEventPattern, of } from 'rxjs';
import { flatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import StellarSDK from 'stellar-sdk';
import { RootState } from '../../configureStore';
import * as rootActions from '../actions';
import * as fromActions from './actions';
import { epics as transactionEpics } from './transaction';

interface OpParams {
  xdr?: string;
  pubKey?: string;
  msg?: string;
  callback?: string;
}

export const openEventsEpic = (
  action$: ActionsObservable<rootActions.Actions>,
  state$: StateObservable<RootState>,
) =>
  action$.pipe(
    ofType(rootActions.SETUP_EVENT_LISTENERS),
    withLatestFrom(state$),
    flatMap(([action, state]) =>
      defer(() =>
        fromEventPattern<[any, string[]]>(
          (h) => electron.ipcRenderer.on('open', h),
          (h) => electron.ipcRenderer.removeListener('open', h),
        ).pipe(
          map((emitterAndArgs) => emitterAndArgs[1]),
          tap((argv) => debug('app:events:open')(argv)),
          flatMap((argv) => {
            // https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md
            const sep007Regex = /^(web\+stellar:)(.*)(\?.*)$/;
            const derp =
              'web+stellar:tx?xdr=AAAAAPVD0Thc3O8AwdpiXqpOCHEpXOtoYrU0578LwCpUIGM8AAAAZAAAAAAAAAABAAAAAQAAAABdJAAdAAAAAF0kAUkAAAAAAAAAAQAAAAEAAAAAdV2iRRpbBLR3%2FXjf%2BxxG0JLMVClrKtmUox%2Fsjbp7bbsAAAAKAAAAFlN0ZWxsYXIgRkkgQW5jaG9yIGF1dGgAAAAAAAEAAABAX3BkamJKcXRhSjZ6ei1tRTdPVkZBWFVlendfWXhPcjZxc2YyUVFHSE9jZjFUcjI4WUsta19EaThrU0pFZzFRSwAAAAAAAAABVCBjPAAAAEDYa1Y93Xoc4zS9eKowf2OChoBR0lOcFsY%2FtKvUzLvpCRKwW97iMJQ%2BX72%2BuE3TYduibzuYdXEUJagJeHHH%2BpkL&callback=url%3Ahttps%3A%2F%2FsomeSigningService.com%2Fa8f7asdfkjha&pubkey=GAU2ZSYYEYO5S5ZQSMMUENJ2TANY4FPXYGGIMU6GMGKTNVDG5QYFW6JS&msg=order%20number%2024';
            //  const matches = argv[1].match(sep007Regex);
            const matches = derp.match(sep007Regex);
            if (!matches) {
              return of(fromActions.Actions.doNothing());
            }
 
            type possibleOperations = 'tx' | 'pay';
            const op = matches[2] as possibleOperations;
            const queryParams = matches[3];
            switch (op) {
              case 'tx':
                const { xdr } = queryString.parse(queryParams) as OpParams;
                return of(
                  new StellarSDK.Transaction(
                    StellarSDK.xdr.TransactionEnvelope.fromXDR(
                      Buffer.from(decodeURIComponent(xdr), 'base64'),
                    ),
                  ),
                ).pipe(
                  flatMap((tx) =>
                    of(fromActions.Actions.startSignTransactionFlow(tx)),
                  ),
                );
              case 'pay':
                return of(fromActions.Actions.doNothing());
              default:
                return of(fromActions.Actions.doNothing());
            }
          }),
        ),
      ),
    ),
  );

export default combineEpics(openEventsEpic, transactionEpics);
