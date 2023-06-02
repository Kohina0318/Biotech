import { applyMiddleware, compose, createStore } from "redux";
import rootReducers from "./rootReducers";

const env = process.env.REACT_APP_ENV;
const middleware = [];
const composeEnhancers =
  env !== "prod" &&
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(...middleware))
);

export { store };
