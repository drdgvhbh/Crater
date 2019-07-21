import React from 'react';
import AnchorsPage from './AnchorsPage';

import { connect } from 'react-redux';

import { anchorActions } from '../store/anchor';
import { RootState } from '../store/configureStore';

const mapStateToProps = (state: RootState) => ({});

const dispatchProps = {
  addAnchor: anchorActions.addAnchor,
};

export const AnchorPageConnected = connect(
  mapStateToProps,
  dispatchProps,
)(AnchorsPage);
export type AnchorPageState = ReturnType<typeof mapStateToProps>;
export type AnchorPageActions = typeof dispatchProps;
