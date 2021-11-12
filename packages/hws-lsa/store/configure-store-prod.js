import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

const middlewares = [thunk];

const persistConfig = {
  key: 'root',
  storage,
  blacklist: 'cache',
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(initialState) {
  const store = createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middlewares)),
  );

  const persistor = persistStore(store);

  return { store, persistor };
}
