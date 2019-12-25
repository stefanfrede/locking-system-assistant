import { handleActions, combineActions } from 'redux-actions';

import {
  HIDE_LOADER,
  SHOW_LOADER,
  LOAD_BUILDS,
  LOAD_DATA,
  LOAD_LENGTHS,
  UPDATE_MESSAGE,
  UPDATE_MODEL,
  UPDATE_INNER_LENGTHS,
  UPDATE_OUTER_LENGTHS,
  UPDATE_SELECTION,
} from '../actions';

const INITIAL_STATE = {
  builds: {},
  data: {},
  guard: 3,
  isLoading: true,
  lengths: {},
  innerLengths: {},
  outerLengths: {},
  message: '',
  msgType: 'info',
  model: 'R9Plus',
  selection: [],
};

export default handleActions(
  {
    [combineActions(HIDE_LOADER, SHOW_LOADER)]: (state, action) => {
      return { ...state, isLoading: action.payload };
    },
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
    [UPDATE_MESSAGE]: (state, action) => {
      return {
        ...state,
        message: action.payload,
        msgType: action.meta.msgType,
      };
    },
    [UPDATE_MODEL]: (state, action) => {
      return { ...state, model: action.payload };
    },
    [UPDATE_INNER_LENGTHS]: (state, action) => {
      return {
        ...state,
        innerLengths: { ...state.innerLengths, ...action.payload },
      };
    },
    [UPDATE_OUTER_LENGTHS]: (state, action) => {
      return {
        ...state,
        outerLengths: { ...state.outerLengths, ...action.payload },
      };
    },
    [UPDATE_SELECTION]: (state, action) => {
      return { ...state, selection: action.payload };
    },
  },
  INITIAL_STATE,
);
