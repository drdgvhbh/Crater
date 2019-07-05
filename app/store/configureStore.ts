import { routerMiddleware } from 'connected-react-router';
import { createHashHistory, createMemoryHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootEpic } from './rootEpic';
import { createRootReducer } from './rootReducer';
export const history = createHashHistory();
const epicMiddleware = createEpicMiddleware<any, any, RootState, void>();

type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any
  ? U
  : any;

export type RootState = Exclude<
  FirstArgument<ReturnType<typeof createRootReducer>>,
  undefined
>;

const rootReducer = createRootReducer(history);

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureStore(preloadedState?: RootState) {
  const store = createStore(
    persistedReducer, // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), epicMiddleware),
    ),
  );

  const persistor = persistStore(store);

  epicMiddleware.run(rootEpic);

  return { store, persistor };
}
