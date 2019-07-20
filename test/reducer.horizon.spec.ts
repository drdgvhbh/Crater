import { horizonActions, horizonReducer } from '@/store/horizon';

describe('reducers', () => {
  describe('horizon', () => {
    test('set horizon server url action', () => {
      const serverURL = 'https://horizon-mainnet.stellar.org';
      const action = horizonActions.setHorizonServerURL({ serverURL });

      const newState = horizonReducer(undefined, action);
      expect(newState.serverURL).toEqual(serverURL);
    });

    test('initial horizon url should be testnet', () => {
      const serverURL = 'https://horizon-testnet.stellar.org';
      const newState = horizonReducer(undefined, {} as any);
      expect(newState.serverURL).toEqual(serverURL);
    });
  });
});
