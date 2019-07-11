// tslint:disable: ordered-imports
import 'react-hot-loader';
import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Root from './Root';
import { configureStore, history } from './store/configureStore';
import debug from 'debug';

if (process.env.NODE_ENV !== 'production') {
  debug.enable('app:*');
}
const { store } = configureStore();

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root'),
);
