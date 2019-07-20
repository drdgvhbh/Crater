import produce from 'immer';
import * as fromActions from './actions';

const initialState = {
  serverURL: 'https://horizon-testnet.stellar.org',
};
export type State = typeof initialState;
export const reducer = (
  state = initialState,
  action: fromActions.Actions,
): State =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_HORIZON_SERVER_URL:
        draft.serverURL = action.payload.serverURL;
        break;
      default:
        break;
    }
  });
