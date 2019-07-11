import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import { pendingTransaction } from '../store/state/selectors';
import SigningPage from './SigningPage';

const mapStateToProps = (state: RootState) => {
  const txn = pendingTransaction(state);
  return {
    transaction: { ...txn, fee: txn.fee.stroops },
  };
};

const dispatchProps = {};

export const SigningPageConnected = connect(
  mapStateToProps,
  dispatchProps,
)(SigningPage);

export type SigningPageState = ReturnType<typeof mapStateToProps>;
export type SigningPageActions = typeof dispatchProps;
