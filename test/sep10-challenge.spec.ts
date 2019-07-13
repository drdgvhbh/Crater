import {
  TransactionChallengeVerificationError,
  TransactionChallengeVerificationErrorType,
  verify,
} from '@/modules/sep10-challenge';
import crypto from 'crypto';
import moment, { Moment } from 'moment';
import StellarSDK, { Keypair } from 'stellar-sdk';

const BASE_FEE_IN_STROOPS = 100;

const buildChallenge = (
  serverAccount: StellarSDK.Account = new StellarSDK.Account(
    StellarSDK.Keypair.random().publicKey(),
    '-1',
  ),
  minTime: Moment = undefined,
  maxTime: Moment = undefined,
  operations: StellarSDK.xdr.Operation[] = [],
) => {
  const isTimeBoundsDefined = minTime && maxTime;

  const txb = new StellarSDK.TransactionBuilder(serverAccount, {
    fee: BASE_FEE_IN_STROOPS,
    timebounds: isTimeBoundsDefined
      ? {
          minTime: minTime.unix(),
          maxTime: maxTime.unix(),
        }
      : undefined,
  });

  operations.forEach((op) => txb.addOperation(op));

  if (!isTimeBoundsDefined) {
    txb.setTimeout(StellarSDK.TimeoutInfinite);
  }

  return txb.build();
};

describe('sep-0010 challenge', () => {
  describe('verify', () => {
    let serverKP: Keypair;
    let serverAccount: StellarSDK.Account;

    let clientKP: Keypair;
    let clientAccount: StellarSDK.Account;

    beforeEach(() => {
      serverKP = StellarSDK.Keypair.random();
      serverAccount = new StellarSDK.Account(serverKP.publicKey(), '-1');

      clientKP = StellarSDK.Keypair.random();
      clientAccount = new StellarSDK.Account(clientKP.publicKey(), '123456789');
    });

    it('should return void if the challenge is valid', () => {
      const tx = buildChallenge(
        serverAccount,
        moment(),
        moment().add(5, 'minutes'),
        [
          StellarSDK.Operation.manageData({
            source: clientAccount.accountId(),
            name: 'LeetAnchor Auth',
            value: crypto.randomBytes(64),
          }),
        ],
      );

      expect(() =>
        verify(tx, {
          serverSigningKey: serverKP.publicKey(),
          clientSigningKey: clientKP.publicKey(),
          ensureTransactionIsSignedByClient: false,
        }),
      ).not.toThrowError();
    });

    it('should throw if server signing key does not match', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
      );

      const incorrectAnchorKP = StellarSDK.Keypair.random();

      try {
        verify(tx, {
          serverSigningKey: incorrectAnchorKP.publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        }),
          expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.InvalidServerSigningKey,
        ).toEqual(
          TransactionChallengeVerificationErrorType.InvalidServerSigningKey,
        );
      }
    });

    it('should throw if sequence number is not 0', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.InvalidSequenceNumber,
        ).toEqual(
          TransactionChallengeVerificationErrorType.InvalidSequenceNumber,
        );
      }
    });

    it('should throw if timebounds is undefined', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.TimeBoundsIsUndefined,
        ).toEqual(
          TransactionChallengeVerificationErrorType.TimeBoundsIsUndefined,
        );
      }
    });
    it('should throw if current time is not within timebounds mintime', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
        moment().add(1, 'second'),
        moment().add(1, 'second'),
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.CurrentTimeIsNotWithinTimeBounds,
        ).toEqual(
          TransactionChallengeVerificationErrorType.CurrentTimeIsNotWithinTimeBounds,
        );
      }
    });

    it('should throw if current time is not within timebounds maxtime', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
        moment().subtract(1, 'second'),
        moment().subtract(1, 'second'),
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.CurrentTimeIsNotWithinTimeBounds,
        ).toEqual(
          TransactionChallengeVerificationErrorType.CurrentTimeIsNotWithinTimeBounds,
        );
      }
    });

    it('should throw if number of operations is greater than one', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
        undefined,
        undefined,
        [
          StellarSDK.Operation.manageData({
            source: clientAccount.accountId(),
            name: 'LeetAnchor Auth',
            value: crypto.randomBytes(64),
          }),
          StellarSDK.Operation.manageData({
            source: clientAccount.accountId(),
            name: 'LeetAnchor Auth',
            value: crypto.randomBytes(64),
          }),
        ],
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.NumberOfOperationsNotEqualToOne,
        ).toEqual(
          TransactionChallengeVerificationErrorType.NumberOfOperationsNotEqualToOne,
        );
      }
    });

    it('should throw if number of operations is less than one', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
        undefined,
        undefined,
        [],
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.NumberOfOperationsNotEqualToOne,
        ).toEqual(
          TransactionChallengeVerificationErrorType.NumberOfOperationsNotEqualToOne,
        );
      }
    });

    it('should throw if operation is not a manage data operation', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
        undefined,
        undefined,
        [
          StellarSDK.Operation.bumpSequence({
            bumpTo: '2',
          }),
        ],
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.OperationIsNotManageData,
        ).toEqual(
          TransactionChallengeVerificationErrorType.OperationIsNotManageData,
        );
      }
    });

    it('should throw if operation is not a manage data operation', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
        undefined,
        undefined,
        [
          StellarSDK.Operation.bumpSequence({
            bumpTo: '2',
          }),
        ],
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.OperationIsNotManageData,
        ).toEqual(
          TransactionChallengeVerificationErrorType.OperationIsNotManageData,
        );
      }
    });

    it('should throw if operation source account is not client', () => {
      const tx = buildChallenge(
        new StellarSDK.Account(Keypair.random().publicKey(), '123456'),
        undefined,
        undefined,
        [
          StellarSDK.Operation.manageData({
            source: clientAccount.accountId(),
            name: 'LeetAnchor Auth',
            value: crypto.randomBytes(64),
          }),
        ],
      );

      try {
        verify(tx, {
          serverSigningKey: Keypair.random().publicKey(),
          clientSigningKey: Keypair.random().publicKey(),
          ensureTransactionIsSignedByClient: false,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(TransactionChallengeVerificationError);
        const txChallengeErr = err as TransactionChallengeVerificationError;
        expect(
          txChallengeErr.type &
            TransactionChallengeVerificationErrorType.OperationSourceAccountDoesNotMatchClient,
        ).toEqual(
          TransactionChallengeVerificationErrorType.OperationSourceAccountDoesNotMatchClient,
        );
      }
    });
  });
});
