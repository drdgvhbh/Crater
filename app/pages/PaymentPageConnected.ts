import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import {
  account,
  accountAssets,
  baseFee,
  exchangeRates,
} from '../store/selectors';
import { walletActions } from '../store/state';
import PaymentPage from './PaymentPage';

const mapStateToProps = (state: RootState) => ({
  assets: accountAssets(state),
  exchangeRates: exchangeRates(state),
  account: account(state),
  baseFee: baseFee(state),
});

const dispatchProps = {
  sendTransaction: walletActions.sendTransaction,
};

export const PaymentPageConnected = connect(
  mapStateToProps,
  dispatchProps,
)(PaymentPage);

export type PaymentPageState = ReturnType<typeof mapStateToProps>;
export type PaymentPageActions = typeof dispatchProps;
