import { handleActions } from 'redux-actions';

import { LOAD_DETAILS, LOAD_LENGTHS } from '../actions';

const INITIAL_STATE = {
  details: {},
  lengths: {},
};

export default handleActions(
  {
    [LOAD_DETAILS]: (state, action) => {
      return { ...state, details: { ...state.details, ...action.payload } };
    },
    [LOAD_LENGTHS]: {
      next: (state, action) => {
        return { ...state, lengths: { ...state.lengths, ...action.payload } };
      },
      throw: (state, action) => {
        return {
          ...state,
          message: action.payload.message,
          msgType: action.meta.msgType,
        };
      },
    },
  },
  INITIAL_STATE,
);
