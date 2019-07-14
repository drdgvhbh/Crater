import { verify as verifyChallengeTransaction } from '@/modules/sep10-challenge';
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import { isObservable, Observable, of, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { flatMap, map, tap } from 'rxjs/operators';
import { Keypair, Transaction } from 'stellar-sdk';
import url from 'url';

export interface AuthenticateClientSideParams {
  allowInsecure: boolean;
}

// https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md#response
interface GetTransactionResponse {
  transaction: string;
  network_passphrase?: string;
}

interface PostTransactionResponse {
  token: string;
}

const getTransactionResponseSchema = Joi.object().keys({
  transaction: Joi.string().required(),
  network_passphrase: Joi.string().optional(),
});

const postTransactionResponseSchema = Joi.object().keys({
  token: Joi.string().required(),
});

export class ValidationError extends Error {
  constructor(public readonly err: Error) {
    super(err.message);
    Error.captureStackTrace(this, ValidationError);
    this.name = ValidationError.name;
  }
}

export class InsecureAuthServerURL extends Error {
  constructor(public readonly authServerURL: url.URL) {
    super('the authorization server must use https');
    Error.captureStackTrace(this, InsecureAuthServerURL);
    this.name = InsecureAuthServerURL.name;
  }
}

export function authenticateClientSide(
  authServerURL: url.URL,
  clientKPInput: Keypair | Observable<Keypair>,
  serverSigningKey: string,
  { allowInsecure }: AuthenticateClientSideParams = {
    allowInsecure: false,
  },
) {
  if (!allowInsecure && authServerURL.protocol !== 'https:') {
    return throwError(new InsecureAuthServerURL(authServerURL));
  }

  return ajax(authServerURL.toString()).pipe(
    map((tx) => tx.response),
    tap((res) => {
      const obj = res
        ? {
            transaction: res.transaction,
            network_passphrase: res.network_passphrase,
          }
        : {};
      const validationResult = getTransactionResponseSchema.validate(obj);
      if (validationResult.error) {
        throw new ValidationError(validationResult.error);
      }
    }),
    map((res) => res as GetTransactionResponse),
    map((res) => [res.transaction, res.network_passphrase]),
    map(
      ([tx, passphrase]) =>
        [new Transaction(tx), passphrase] as [Transaction, string],
    ),
    flatMap(([txe, passphrase]) =>
      (isObservable(clientKPInput) ? clientKPInput : of(clientKPInput)).pipe(
        map((kp) => [txe, passphrase, kp] as [Transaction, string, Keypair]),
      ),
    ),
    tap(([txe, passphrase, clientKP]) => {
      verifyChallengeTransaction(txe, {
        serverSigningKey,
        clientSigningKey: clientKP.publicKey(),
        ensureTransactionIsSignedByClient: false,
      });

      txe.sign(clientKP);
    }),
    map(([txe]) => txe.toEnvelope().toXDR('base64')),
    flatMap((xdr) =>
      ajax
        .post(
          authServerURL.toString(),
          { transaction: xdr },
          { 'content-type': 'application/json' },
        )
        .pipe(
          map((res) => res.response as PostTransactionResponse),
          tap((res) => {
            const obj = res
              ? {
                  token: res.token,
                }
              : {};
            const validationResult = postTransactionResponseSchema.validate(
              obj,
            );
            if (validationResult.error) {
              throw new ValidationError(validationResult.error);
            }
          }),
          map((res) => res.token),
          tap((token) => {
            if (!jwt.decode(token)) {
              throw new ValidationError(new Error('token cannot be decoded'));
            }
          }),
        ),
    ),
  );
}
