import { anchorActions, anchorReducer } from '@/store/state/anchor';

describe('reducers', () => {
  describe('anchor', () => {
    test('set anchor access token action', () => {
      const token = 'some jwt token';
      const signingKey =
        'GD6IRJRB6UBUGOERKQRXO6PD6Y6H5L7ZUJ5FCGZT52GA6TOAXAEFMSJ5';
      const action = anchorActions.setAnchorAccessToken({
        token,
        anchorSigningKey: signingKey,
      });
      const newState = anchorReducer(undefined, action);
      expect(newState.tokens[signingKey]).toEqual(token);
    });
  });
});
