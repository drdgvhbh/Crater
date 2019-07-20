import AnchorsPage from './AnchorsPage';
import React from 'react';

import { connect } from 'react-redux';

import { RootState } from '../store/configureStore';
import { anchorActions } from '../store/state/anchor';

const mapStateToProps = (state: RootState) => ({
});

const dispatchProps = {
  addAnchor: anchorActions.addAnchor,
};

export const AnchorPageConnected = connect(
  mapStateToProps,
  dispatchProps,
)(AnchorsPage);
export type AnchorPageState = ReturnType<typeof mapStateToProps>;
export type AnchorPageActions = typeof dispatchProps;
