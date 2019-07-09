import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import { signatureTransactionEnvelope } from '../store/state/selectors';
import SigningPage from './SigningPage';

const mapStateToProps = (state: RootState) => ({
  transaction: signatureTransactionEnvelope(state),
});

const dispatchProps = {};

export const SigningPageConnected = connect(
  mapStateToProps,
  dispatchProps,
)(SigningPage);

export type SigningPageState = ReturnType<typeof mapStateToProps>;
export type SigningPageActions = typeof dispatchProps;
