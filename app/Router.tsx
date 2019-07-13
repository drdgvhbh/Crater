import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { AppPage, MainPage, NewWalletPage } from './pages';
import routes from './routes.json';
import { RootState } from './store/configureStore';
import { walletActions } from './store/state/index';

const Router = ({
  fetchBaseFee,
  fetchPreexistingMnemonic,
  setupEventListeners,
}: RouterActions) => {
  useEffect(() => {
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
      </Switch>
    </>
  );
};

const mapStateToProps = (_: RootState) => ({});

const dispatchProps = {
  fetchPreexistingMnemonic: walletActions.fetchPreexistingMnemonic,
  fetchBaseFee: walletActions.fetchBaseFee,
  setupEventListeners: walletActions.setupEvenListeners,
};

const RouterConnected = connect(
  mapStateToProps,
  dispatchProps,
)(Router);
type RouterActions = typeof dispatchProps;

export default RouterConnected;