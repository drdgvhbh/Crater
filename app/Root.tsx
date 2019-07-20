import { createMuiTheme } from '@material-ui/core';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import * as React from 'react';
import { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import Router from './Router';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#37474f',
      light: '#62727b',
      dark: '#102027',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    h1: {
      fontSize: '36px',
      fontWeight: 'lighter',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 'normal',
    },
  },
});

interface Props {
  store: Store<any>;
  history: History<any>;
}

class Root extends Component<Props> {
  render() {
    const { store, history } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Router />
          </ConnectedRouter>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default hot(Root);
