import produce from 'immer';
import * as fromActions from './actions';

const initialState = {
  tokens: {} as { [key: string]: string },
};

export const reducer = (state = initialState, action: fromActions.Actions) =>
  produce(state, (draft) => {
    switch (action.type) {
      case fromActions.SET_ANCHOR_ACCESS_TOKEN:
        const { anchorSigningKey, token } = action.payload;
        draft.tokens[anchorSigningKey] = token;
        break;
      default:
        break;
    }
  });
