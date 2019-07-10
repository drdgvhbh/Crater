import {
  Operation,
  reducer as signatureReducer,
} from '@/store/state/signature/transaction';
import * as fromActions from '@/store/state/signature/transaction/actions';
import crypto from 'crypto';

describe('Reducer Tests', () => {
  describe('Signature Transaction Reducer', () => {
    it('should set an array of operations', () => {
      const manageDataOp: Operation = {
        sourceAccount:
          'GB2V3ISFDJNQJNDX7V4N76Y4I3IJFTCUFFVSVWMUUMP6ZDN2PNW3WZ64',
        name: 'Stellar FI Authentication',
        type: 'manageData',
        value: crypto.randomBytes(64).toString('base64'),
      };
      const newState = signatureReducer(
        undefined,
        fromActions.Actions.setSignatureOperations([manageDataOp]),
      );
      expect(newState.operations).toEqual([manageDataOp]);
    });
  });
});
