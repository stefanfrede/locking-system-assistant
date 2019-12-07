import { combineReducers } from 'redux';

import app from './app';
import cache from './cache';

export default combineReducers({
  app,
  cache,
});
