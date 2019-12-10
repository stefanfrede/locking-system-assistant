import { handleActions, combineActions } from 'redux-actions';

import {
  HIDE_LOADER,
  SHOW_LOADER,
  INCREMENT_COLUMNS,
  DECREMENT_COLUMNS,
  INCREMENT_ROWS,
  DECREMENT_ROWS,
  UPDATE_MODEL,
  LOAD_BUILDS,
  LOAD_LENGTHS,
  UPDATE_INNER_LENGTHS,
  UPDATE_OUTER_LENGTHS,
} from '../actions';

const INITIAL_STATE = {
  builds: [],
  data: [],
  columns: 5,
  isLoading: true,
  lengths: {},
  innerLengths: {},
  outerLengths: {},
  model: 'R9Plus',
  rows: 5,
};

export default handleActions(
  {
    [combineActions(HIDE_LOADER, SHOW_LOADER)]: (state, action) => {
      return { ...state, isLoading: action.payload };
    },
    [combineActions(INCREMENT_COLUMNS, DECREMENT_COLUMNS)]: (state, action) => {
      return { ...state, columns: state.columns + action.payload.amount };
    },
    [combineActions(INCREMENT_ROWS, DECREMENT_ROWS)]: (state, action) => {
      return { ...state, rows: state.rows + action.payload.amount };
    },
    [LOAD_BUILDS]: (state, action) => {
      return { ...state, builds: action.payload };
    },
    [LOAD_LENGTHS]: (state, action) => {
      return { ...state, lengths: { ...state.lengths, ...action.payload } };
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
  },
  INITIAL_STATE,
);
