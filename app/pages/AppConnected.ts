import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import { walletActions } from '../store/state';
import { isMnemonicValid } from '../store/selectors';
import App from './App';

const mapStateToProps = (state: RootState) => ({
  isMnemonicValid: isMnemonicValid(state),
});

const dispatchProps = {
  login: walletActions.login
};

export const AppConnected = connect(
  mapStateToProps,
  dispatchProps,
)(App);
