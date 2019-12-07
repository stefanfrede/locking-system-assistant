import {
  ADD_BUILDS,
  ADD_COLUMNS,
  REMOVE_COLUMNS,
  ADD_ROWS,
  REMOVE_ROWS,
  SHOW_LOADING,
  UPDATE_LENGTH,
  UPDATE_MODEL,
  UPDATE_URL,
} from '../actions';

const INITIAL_STATE = {
  builds: [],
  columns: 5,
  length: {},
  loading: false,
  model: 'R9Plus',
  rows: 5,
  url: 'https://www.schweisthal.de/de/api/products/',
};

const app = (state = INITIAL_STATE, action = null) => {
  switch (action.type) {
    case ADD_BUILDS:
      return {
        ...state,
        builds: action.builds,
      };
    case ADD_COLUMNS:
      return {
        ...state,
        columns: state.columns + action.columns,
      };
    case REMOVE_COLUMNS:
      return {
        ...state,
        columns: state.columns - action.columns,
      };
    case ADD_ROWS:
      return {
        ...state,
        rows: state.rows + action.rows,
      };
    case REMOVE_ROWS:
      return {
        ...state,
        rows: state.rows - action.rows,
      };
    case SHOW_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case UPDATE_LENGTH:
      return {
        ...state,
        length: { ...state.length, ...action.length },
      };
    case UPDATE_MODEL:
      return {
        ...state,
        model: action.model,
      };
    case UPDATE_URL:
      return {
        ...state,
        url: action.url,
      };
    default:
      return state;
  }
};

export default app;
