import {
  Operation,
  reducer as signatureReducer,
} from '@/store/state/signature/transaction';
import * as fromActions from '@/store/state/signature/transaction/actions';
import crypto from 'crypto';

describe('Reducer Tests', () => {
  describe('Signature Transaction Reducer', () => {
    test('Set Signing Transaction Operations', () => {
      const manageDataOp: Operation = {
        sourceAccount:
          'GB2V3ISFDJNQJNDX7V4N76Y4I3IJFTCUFFVSVWMUUMP6ZDN2PNW3WZ64',
        name: 'Stellar FI Authentication',
        type: 'manageData',
        value: crypto.randomBytes(64).toString('base64'),
      };
      const newState = signatureReducer(
        undefined,
        fromActions.Actions.setSigningTransactionOperations([manageDataOp]),
      );
      expect(newState.operations).toEqual([manageDataOp]);
    });

    test('Set Signing Txn Source Act', () => {
      const sourceAct =
        'GBUN4CIWUM325Z2GIVWWB35FU4LLD5QL4K2X6ROGCZMBS5BPWNPKCNIT';
      const newState = signatureReducer(
        undefined,
        fromActions.Actions.setSigningTxnSourceAct(sourceAct),
      );
      expect(newState.sourceAccount).toEqual(sourceAct);
    });

    test('Set Signing Txn Sequence Number', () => {
      const sequenceNumber = 123456789;
      const newState = signatureReducer(
        undefined,
        fromActions.Actions.setSigningTxnSequenceNumber(sequenceNumber),
      );
      expect(newState.sequenceNumber).toEqual(sequenceNumber);
    });
  });
});
