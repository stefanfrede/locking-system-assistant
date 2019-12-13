import { handleActions } from 'redux-actions';

import { CACHE_BUILDS, CACHE_LENGTHS } from '../actions';

const INITIAL_STATE = {
  builds: {},
  lengths: {},
};

export default handleActions(
  {
    [CACHE_BUILDS]: (state, action) => {
      return { ...state, builds: { ...state.builds, ...action.payload } };
    },
    [CACHE_LENGTHS]: (state, action) => {
      return { ...state, lengths: { ...state.lengths, ...action.payload } };
    },
  },
  INITIAL_STATE,
);
