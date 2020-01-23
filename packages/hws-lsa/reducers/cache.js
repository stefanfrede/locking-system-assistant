import { handleActions } from 'redux-actions';

import {
  LOAD_BUILDS,
  LOAD_DETAILS,
  LOAD_LENGTHS,
  LOAD_MODELS,
  UPDATE_MESSAGE,
} from '../actions';

const INITIAL_STATE = {
  builds: {},
  details: {},
  lengths: {},
  message: '',
  msgType: 'info',
  models: [],
};

export default handleActions(
  {
    [LOAD_BUILDS]: {
      next: (state, action) => {
        return { ...state, builds: { ...state.builds, ...action.payload } };
      },
      throw: (state, action) => {
        return {
          ...state,
          message: action.payload.message,
          msgType: action.meta.msgType,
        };
      },
    },
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
    [UPDATE_MESSAGE]: (state, action) => {
      return {
        ...state,
        message: action.payload,
        msgType: action.meta.msgType,
      };
    },
  },
  INITIAL_STATE,
);
