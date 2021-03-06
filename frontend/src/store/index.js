// External dependencies
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Internal dependencies
import sessionReducer from "./session";
import trackReducer from "./track";
import playerReducer from "./player";
import userReducer from "./user";

//----------------------------------------------
// Rootreducer
const rootReducer = combineReducers({
  session: sessionReducer,
  track: trackReducer,
  player: playerReducer,
  user: userReducer,
});

// Store Enhancer
let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

//----------------------------------------------
// Store Creator
const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;