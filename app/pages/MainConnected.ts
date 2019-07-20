import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import { account, mnemonic } from '../store/selectors';
import MainPage from './Main';

const mapStateToProps = (state: RootState) => ({
  mnemonic: mnemonic(state),
  account: account(state),
});

const dispatchProps = {};

export const MainConnected = connect(
  mapStateToProps,
  dispatchProps,
)(MainPage);
