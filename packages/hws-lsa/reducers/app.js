import { handleActions, combineActions } from 'redux-actions';

import {
  HIDE_LOADER,
  SHOW_LOADER,
  ADD_BUILDS,
  ADD_GROUP,
  DELETE_GROUP,
  UPDATE_GROUPS,
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
  ADD_INNER_LENGTH,
  DELETE_INNER_LENGTH,
  ADD_OUTER_LENGTH,
  DELETE_OUTER_LENGTH,
  ADD_ROW_ID,
  DELETE_ROW_ID,
  UPDATE_MESSAGE,
  UPDATE_MODEL,
} from '../actions';

const INITIAL_STATE = {
  builds: {},
  details: {},
  groups: [],
  guard: 3,
  innerLengths: {},
  items: {},
  keys: 5,
  loading: true,
  message: '',
  model: 'R9Plus',
  msgType: 'info',
  outerLengths: {},
  rowIds: [],
  rows: 5,
};

export default handleActions(
  {
    [combineActions(HIDE_LOADER, SHOW_LOADER)]: (state, action) => {
      return { ...state, loading: action.payload };
    },
    [combineActions(ADD_ITEM, UPDATE_ITEM)]: (state, action) => {
      return { ...state, items: { ...state.items, ...action.payload } };
    },
    [ADD_BUILDS]: {
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
    [ADD_GROUP]: (state, action) => {
      return {
        ...state,
        groups: [...state.groups, action.payload],
        keys: action.meta.keys,
      };
    },
    [DELETE_GROUP]: (state, action) => {
      return {
        ...state,
        groups: [
          ...state.groups.slice(0, action.payload),
          ...state.groups.slice(action.payload + 1),
        ],
        keys: action.meta.keys,
      };
    },
    [UPDATE_GROUPS]: (state, action) => {
      return {
        ...state,
        groups: [...action.payload],
      };
    },
    [DELETE_ITEM]: (state, action) => {
      return {
        ...state,
        items: Object.keys(state.items).reduce(
          (acc, cur) =>
            cur !== action.payload ? ((acc[cur] = state.items[cur]), acc) : acc,
          {},
        ),
      };
    },
    [ADD_INNER_LENGTH]: (state, action) => {
      return {
        ...state,
        innerLengths: { ...state.innerLengths, ...action.payload },
      };
    },
    [DELETE_INNER_LENGTH]: (state, action) => {
      return {
        ...state,
        innerLengths: Object.keys(state.innerLengths).reduce(
          (acc, cur) =>
            cur !== action.payload
              ? ((acc[cur] = state.innerLengths[cur]), acc)
              : acc,
          {},
        ),
      };
    },
    [ADD_OUTER_LENGTH]: (state, action) => {
      return {
        ...state,
        outerLengths: { ...state.outerLengths, ...action.payload },
      };
    },
    [DELETE_OUTER_LENGTH]: (state, action) => {
      return {
        ...state,
        outerLengths: Object.keys(state.outerLengths).reduce(
          (acc, cur) =>
            cur !== action.payload
              ? ((acc[cur] = state.outerLengths[cur]), acc)
              : acc,
          {},
        ),
      };
    },
    [ADD_ROW_ID]: (state, action) => {
      return {
        ...state,
        rowIds: [...state.rowIds, action.payload],
        rows: action.meta.rows,
      };
    },
    [DELETE_ROW_ID]: (state, action) => {
      return {
        ...state,
        rowIds: [
          ...state.rowIds.slice(0, action.payload),
          ...state.rowIds.slice(action.payload + 1),
        ],
        rows: action.meta.rows,
      };
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
  },
  INITIAL_STATE,
);
