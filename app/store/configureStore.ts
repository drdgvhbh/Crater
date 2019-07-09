import { routerMiddleware } from 'connected-react-router';
import { createHashHistory, createMemoryHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
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

export function configureStore(preloadedState?: RootState) {
  const store = createStore(
    rootReducer, // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), epicMiddleware),
    ),
  );

  epicMiddleware.run(rootEpic);

  return { store };
}
