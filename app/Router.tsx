import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { AppPage, MainPage, NewWalletPage } from './pages';
import { AnchorPageConnected } from './pages/AnchorPageConnected';
import routes from './routes.json';
import { RootState } from './store/configureStore';
import { networkActions } from './store/network';
import { walletActions } from './store/state/index';

const Router = ({
  fetchBaseFee,
  fetchPreexistingMnemonic,
  setupEventListeners,
  setNetwork,
}: RouterActions) => {
  useEffect(() => {
    setNetwork();
    fetchBaseFee(); 
    fetchPreexistingMnemonic();
    setupEventListeners();
  }, []);

  return (
    <>
      <Switch>
        <Route path={routes.HOME} exact component={AppPage} />
        <Route path={routes.MAIN} exact component={MainPage} />
        <Route path={routes.NEW_WALLET} exact component={NewWalletPage} />
        <Route path={routes.ANCHORS} exact component={AnchorPageConnected} />
      </Switch>
    </>
  );
};

const mapStateToProps = (_: RootState) => ({});

const dispatchProps = {
  fetchPreexistingMnemonic: walletActions.fetchPreexistingMnemonic,
  fetchBaseFee: walletActions.fetchBaseFee,
  setupEventListeners: walletActions.setupEvenListeners,
  setNetwork: networkActions.useTestnet,
};

const RouterConnected = connect(
  mapStateToProps,
  dispatchProps,
)(Router);
type RouterActions = typeof dispatchProps;

export default RouterConnected;
