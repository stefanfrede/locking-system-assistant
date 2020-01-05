import { handleActions } from 'redux-actions';

import { LOAD_DATA, LOAD_LENGTHS, LOAD_MODELS } from '../actions';

const INITIAL_STATE = {
  data: {},
  lengths: {},
  models: ['R9Plus'],
};

export default handleActions(
  {
    [LOAD_DATA]: (state, action) => {
      return { ...state, data: { ...state.data, ...action.payload } };
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
    [LOAD_MODELS]: {
      next: (state, action) => {
        return { ...state, models: [...state.models, ...action.payload] };
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
