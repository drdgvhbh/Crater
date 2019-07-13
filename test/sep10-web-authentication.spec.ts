import {
  authenticateClientSide,
  InsecureAuthServerURL,
  ValidationError,
} from '@/modules/sep10-web-authentication';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { of } from 'rxjs';
import {
  Account,
  Keypair,
  Network,
  Operation,
  Transaction,
  TransactionBuilder,
} from 'stellar-sdk';
import url from 'url';

Network.useTestNetwork();

const BASE_FEE_IN_STROOPS = 100;

jest.mock('../app/modules/sep10-challenge', () => {
  return {
    __esModule: true,
    verify: jest.fn(),
  };
});
jest.mock('rxjs/ajax', () => {
  return {
    __esModule: true,
    ajax: jest.fn(() => ({
      post: jest.fn(),
    })),
  };
});

describe('sep-0010 web authentication', () => {
  describe('client side authentication', () => {
    let serverKP: Keypair;
    let serverAccount: Account;
    let clientAccount: Account;
    let clientKP: Keypair;
    let txe: Transaction;

    beforeEach(() => {
      serverKP = Keypair.random();
      clientKP = Keypair.random();
      serverAccount = new Account(serverKP.publicKey(), '-1');
      clientAccount = new Account(clientKP.publicKey(), '1234456789');
      txe = new TransactionBuilder(serverAccount, {
        fee: BASE_FEE_IN_STROOPS,
        timebounds: {
          minTime: moment()
            .subtract(1, 'minute')
            .unix(),
          maxTime: moment()
            .add(1, 'minute')
            .unix(),
        },
      })
        .addOperation(
          Operation.manageData({
            source: clientAccount.accountId(),
            name: 'LeetAnchor Auth',
            value: crypto.randomBytes(64),
          }),
        )
        .build();
      txe.sign(serverKP);
    });

    it('should throw if GET/ challenge transaction does not pass validation', async () => {
      const spy = jest.spyOn(require('rxjs/ajax'), 'ajax');
      spy.mockReturnValueOnce(
        of({
          response: null,
        }),
      );
      const authServerURL = new url.URL('', 'https://mybank.com');
      const promise = authenticateClientSide(
        authServerURL,
        clientKP,
        serverKP.publicKey(),
      ).toPromise();
      expect(promise)
        .rejects.toThrowError(ValidationError)
        .then(() => {
          spy.mockClear();
        });
    });

    it('should allow extraneous properties for GET/ challenge transaction', async () => {
      const spy = jest.spyOn(require('rxjs/ajax'), 'ajax');
      spy.mockReturnValueOnce(
        of({
          response: {
            transaction: txe.toEnvelope().toXDR('base64'),
            a: 'asdf',
          },
        }),
      );
      const authServerURL = new url.URL('', 'https://mybank.com');
      const promise = authenticateClientSide(
        authServerURL,
        clientKP,
        serverKP.publicKey(),
      ).toPromise();
      try {
        await promise;
      } catch (err) {
        expect(err).not.toBeInstanceOf(ValidationError);
      } finally {
        spy.mockClear();
      }
    });

    it('should not allow non https urls if allow insecure is false', () => {
      const authServerURL = new url.URL('', 'http://mybank.com');
      const promise = authenticateClientSide(
        authServerURL,
        clientKP,
        serverKP.publicKey(),
      ).toPromise();
      expect(promise).rejects.toThrowError(InsecureAuthServerURL);
    });

    it('should verify challenge transaction', (done) => {
      const spy = jest.spyOn(require('rxjs/ajax'), 'ajax');
      spy.mockImplementationOnce(() =>
        of({
          response: {
            transaction: txe.toEnvelope().toXDR('base64'),
          },
        }),
      );
      const post = jest.fn(() => of({}));
      require('rxjs/ajax').ajax.post = post;
      //  ((spy as jest.Mock).mock as any).post = jest.fn(() => of());
      const authServerURL = new url.URL('', 'https://mybank.com');
      const promise = authenticateClientSide(
        authServerURL,
        clientKP,
        serverKP.publicKey(),
      ).toPromise();
      expect(promise)
        .resolves.toBeTruthy()
        .then(() => {
          const { verify } = require('@/modules/sep10-challenge');
          expect(verify).toBeCalledWith(expect.anything(), {
            serverSigningKey: serverKP.publicKey(),
            clientSigningKey: clientKP.publicKey(),
            ensureTransactionIsSignedByClient: false,
          });
          spy.mockClear();
          post.mockClear();
          done();
        });
    });

    it('should POST the signed transaction hash back to the auth server', (done) => {
      const spy = jest.spyOn(require('rxjs/ajax'), 'ajax');
      spy.mockReturnValueOnce(
        of({
          response: {
            transaction: txe.toEnvelope().toXDR('base64'),
          },
        }),
      );

      const postTxResp = {
        token: jwt.sign(
          {
            iss: 'https://some-anchor.com',
            sub: clientKP.publicKey,
            iat: moment().unix(),
            exp: moment()
              .add(1, 'day')
              .unix(),
            jti: () => {
              txe.sign(clientKP);
              return txe.hash().toString('base64');
            },
          },
          serverKP.secret(),
        ),
      };
      const post = jest.fn(() => of(postTxResp));
      require('rxjs/ajax').ajax.post = post;
      const authServerURL = new url.URL('', 'https://mybank.com');

      const promise = authenticateClientSide(
        authServerURL,
        clientKP,
        serverKP.publicKey(),
      ).toPromise();
      expect(promise)
        .resolves.toEqual(postTxResp)
        .then(() => {
          txe.sign(clientKP);
          const signedTxe = txe.toEnvelope();
          const xdr = signedTxe.toXDR('base64');
          expect(post).toBeCalledWith(
            authServerURL.toString(),
            { transaction: xdr },
            {
              'content-type': 'application/json',
            },
          );
          spy.mockClear();
          post.mockClear();
          done();
        });
    });
  });
});
