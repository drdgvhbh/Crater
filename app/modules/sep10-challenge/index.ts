import moment from 'moment';
import { Transaction } from 'stellar-sdk';

export interface VerifyOptions {
  serverSigningKey: string;
  clientSigningKey: string;
  ensureTransactionIsSignedByClient: boolean;
}

export enum TransactionChallengeVerificationErrorType {
  InvalidServerSigningKey = 1 << 0,
  InvalidSequenceNumber = 1 << 1,
  TimeBoundsIsUndefined = 1 << 2,
  CurrentTimeIsNotWithinTimeBounds = 1 << 3,
  NumberOfOperationsNotEqualToOne = 1 << 4,
  OperationIsNotManageData = 1 << 5,
  OperationSourceAccountDoesNotMatchClient = 1 << 6,
}

export class TransactionChallengeVerificationError extends Error {
  constructor(public readonly type: number) {
    super('transaction challenge is not valid');
    Error.captureStackTrace(this, TransactionChallengeVerificationError);

    this.name = TransactionChallengeVerificationError.name;
  }
}

export function verify(
  tx: Transaction,
  {
    serverSigningKey,
    clientSigningKey,
    ensureTransactionIsSignedByClient,
  }: VerifyOptions,
) {
  let err = 0;
  if (tx.source !== serverSigningKey) {
    err |= TransactionChallengeVerificationErrorType.InvalidServerSigningKey;
  }
  if (tx.sequence != 0) {
    err |= TransactionChallengeVerificationErrorType.InvalidSequenceNumber;
  }

  const { timeBounds } = tx;
  if (timeBounds) {
    const minTime = moment.unix(Number(tx.timeBounds.minTime));
    const maxTime = moment.unix(Number(tx.timeBounds.maxTime));
    const now = moment();
    if (now.isBefore(minTime) || now.isAfter(maxTime)) {
      err |=
        TransactionChallengeVerificationErrorType.CurrentTimeIsNotWithinTimeBounds;
    }
  } else {
    err |= TransactionChallengeVerificationErrorType.TimeBoundsIsUndefined;
  }

  if (tx.operations.length !== 1) {
    err |=
      TransactionChallengeVerificationErrorType.NumberOfOperationsNotEqualToOne;
  } else {
    const op = tx.operations[0];
    switch (op.type) {
      case 'manageData':
        if (op.source !== clientSigningKey) {
          err |=
            TransactionChallengeVerificationErrorType.OperationSourceAccountDoesNotMatchClient;
        }
        break;
      default:
        err |=
          TransactionChallengeVerificationErrorType.OperationIsNotManageData;
        break;
    }
  }

  if (err) {
    throw new TransactionChallengeVerificationError(err);
  }
}
