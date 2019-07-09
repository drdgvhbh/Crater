import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import { walletActions } from '../store/state';
import {
  account,
  accountAssets,
  baseFee,
  exchangeRates,
} from '../store/state/selectors';
import MoneyPage from './MoneyPage';

const mapStateToProps = (state: RootState) => ({
  assets: accountAssets(state),
  exchangeRates: exchangeRates(state),
  account: account(state),
  baseFee: baseFee(state),
});

const dispatchProps = {
  sendTransaction: walletActions.sendTransaction,
};

export const MoneyPageConnected = connect(
  mapStateToProps,
  dispatchProps,
)(MoneyPage);

export type MoneyPageState = ReturnType<typeof mapStateToProps>;
export type MoneyPageActions = typeof dispatchProps;
