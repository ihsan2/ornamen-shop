import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore} from 'redux-persist';
import rootReducer from './reducers';

const configureStore = () => {
  let store = createStore(rootReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return {store, persistor};
};

const {store, persistor} = configureStore();

export {store, persistor};
