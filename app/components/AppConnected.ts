import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import { walletActions } from '../store/state';
import { isMnemonicValid } from '../store/state/selectors';
import App from './App';

const mapStateToProps = (state: RootState) => ({
  isMnemonicValid: isMnemonicValid(state),
});

const dispatchProps = {
  login: walletActions.login,
  fetchPreexistingMnemonic: walletActions.fetchPreexistingMnemonic,
  fetchBaseFee: walletActions.fetchBaseFee,
};

export const AppConnected = connect(
  mapStateToProps,
  dispatchProps,
)(App);
