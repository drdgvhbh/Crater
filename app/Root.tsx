import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { AppConnected } from './components/AppConnected';
import { MainPage, NewWalletPage } from './pages';
import routes from './routes.json';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#37474f',
      light: '#62727b',
      dark: '#102027',
    },
  },
});

interface Props {
  store: Store<any>;
  history: History<any>;
  persistor: Persistor;
}

export default class Root extends Component<Props> {
  render() {
    const { store, history, persistor } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <>
                <Switch>
                  <Route path={routes.HOME} exact component={AppConnected} />
                  <Route path={routes.MAIN} exact component={MainPage} />
                  <Route
                    path={routes.NEW_WALLET}
                    exact
                    component={NewWalletPage}
                  />
                </Switch>
              </>
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    );
  }
}
