import { connect } from 'react-redux';
import { RootState } from '../store/configureStore';
import {
  deriveExchangeRate,
  exchangeRates,
  stroopToXLM,
} from '../store/selectors';
import Fee from './Fee';

const mapStateToProps = (state: RootState) => {
  const xlmToUsd = (xlm: number) =>
    deriveExchangeRate('xlm', 'usd', exchangeRates(state)) * xlm;

  return {
    xlmToUsd,
    stroopToXLM,
  };
};

const dispatchProps = {};

export const FeeConnected = connect(
  mapStateToProps,
  dispatchProps,
)(Fee);
export type FeeState = ReturnType<typeof mapStateToProps>;
export type FeeActions = typeof dispatchProps;
