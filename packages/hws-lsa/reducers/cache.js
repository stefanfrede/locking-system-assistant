import { handleActions } from 'redux-actions';

import { CACHE_BUILDS, CACHE_DATA, CACHE_LENGTHS } from '../actions';

const INITIAL_STATE = {
  builds: {},
  data: {},
  lengths: {},
};

export default handleActions(
  {
    [CACHE_BUILDS]: (state, action) => {
      return { ...state, builds: { ...state.builds, ...action.payload } };
    },
    [CACHE_DATA]: (state, action) => {
      return { ...state, data: { ...state.data, ...action.payload } };
    },
    [CACHE_LENGTHS]: (state, action) => {
      return { ...state, lengths: { ...state.lengths, ...action.payload } };
    },
  },
  INITIAL_STATE,
);
