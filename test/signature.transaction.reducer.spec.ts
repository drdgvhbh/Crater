import {
  Operation,
  reducer as signatureReducer,
} from '@/store/state/signature/transaction';
import * as fromActions from '@/store/state/signature/transaction/actions';
import { SetSignatureTxnDetailsParams } from '@/store/state/signature/transaction/actions';
import crypto from 'crypto';
import moment from 'moment';

describe('Reducer Tests', () => {
  describe('Signature Transaction Reducer', () => {
    let op: Operation;
    let txnDetails: SetSignatureTxnDetailsParams;

    beforeEach(() => {
      op = {
        sourceAccount:
          'GB2V3ISFDJNQJNDX7V4N76Y4I3IJFTCUFFVSVWMUUMP6ZDN2PNW3WZ64',
        name: 'Stellar FI Authentication',
        type: 'manageData',
        value: crypto.randomBytes(64).toString('base64'),
      };
      txnDetails = {
        sourceAccount:
          'GBUN4CIWUM325Z2GIVWWB35FU4LLD5QL4K2X6ROGCZMBS5BPWNPKCNIT',
        sequenceNumber: 0,
        memo: 'Money Money Money',
        fee: 100,
        operations: [op],
        timebounds: [moment(), moment().add(5, 'minutes')],
        signatures: [],
      };
    });

    test('Set Signing Transaction Details', () => {
      const newState = signatureReducer(
        undefined,
        fromActions.Actions.setSignatureTxnDetails(txnDetails),
      );
      expect(newState.sourceAccount).toEqual(txnDetails.sourceAccount);
      expect(newState.sequenceNumber).toEqual(txnDetails.sequenceNumber);
      expect(newState.memo).toEqual(txnDetails.memo);
      expect(newState.fee).toEqual(txnDetails.fee);
      expect(newState.operations).toEqual([op]);
      expect(newState.timebounds).toEqual(
        txnDetails.timebounds.map((txn) => txn.toISOString()),
      );
    });

    test('Does Not Set Signing Txn Memo If Null', () => {
      const newState = signatureReducer(
        undefined,
        fromActions.Actions.setSignatureTxnDetails({
          ...txnDetails,
          memo: null,
        }),
      );
      expect(newState.memo).toEqual('');
    });
  });
});
