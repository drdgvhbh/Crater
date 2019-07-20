import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import rgbhex from 'rgb-hex';
import { RootState } from '../store/configureStore';
import {
  accountAssetsInUSD,
  colorPalette,
  totalAccountValueInUSD,
} from '../store/selectors';
import AssetPieChart from './AssetPieChart';

const assetsSelector = createSelector(
  accountAssetsInUSD,
  colorPalette,
  (assets, colors) =>
    assets.map(({ type, amount, usd }, idx) => ({
      name: type,
      value: usd,
      quantity: amount,
      color: `#${rgbhex(colors[idx])}`,
    })),
);

const mapStateToProps = (state: RootState) => ({
  assets: assetsSelector(state),
  totalAccountValueInUSD: totalAccountValueInUSD(state),
});

const dispatchProps = {};

export const AssetPieChartConnected = connect(
  mapStateToProps,
  dispatchProps,
)(AssetPieChart);
