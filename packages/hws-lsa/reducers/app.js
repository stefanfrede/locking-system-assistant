import { handleActions, combineActions } from 'redux-actions';

import {
  HIDE_LOADER,
  SHOW_LOADER,
  ADD_BUILDS,
  ADD_GROUP,
  ADD_INNER_LENGTH,
  ADD_ITEM,
  ADD_MODELS,
  ADD_OUTER_LENGTH,
  DELETE_GROUP,
  DELETE_ITEM,
  DELETE_INNER_LENGTH,
  DELETE_OUTER_LENGTH,
  UPDATE_GROUPS,
  UPDATE_ITEM,
  UPDATE_MESSAGE,
  UPDATE_MODEL,
} from '../actions';

const INITIAL_STATE = {
  builds: {},
  groups: [],
  guard: 3,
  innerLengths: {},
  items: {},
  keys: 5,
  loading: true,
  message: '',
  model: 'R9Plus',
  models: [],
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
    [ADD_INNER_LENGTH]: (state, action) => {
      return {
        ...state,
        innerLengths: { ...state.innerLengths, ...action.payload },
      };
    },
    [ADD_ITEM]: (state, action) => {
      return {
        ...state,
        items: { ...state.items, ...action.payload },
        rowIds: [...state.rowIds, action.meta.index],
        rows: action.meta.rows + 1,
      };
    },
    [ADD_OUTER_LENGTH]: (state, action) => {
      return {
        ...state,
        outerLengths: { ...state.outerLengths, ...action.payload },
      };
    },
    [ADD_MODELS]: {
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
    [DELETE_ITEM]: (state, action) => {
      return {
        ...state,
        items: Object.keys(state.items).reduce(
          (acc, cur) =>
            cur !== action.payload ? ((acc[cur] = state.items[cur]), acc) : acc,
          {},
        ),
        rowIds: [
          ...state.rowIds.slice(0, action.meta.index),
          ...state.rowIds.slice(action.meta.index + 1),
        ],
        rows: action.meta.rows - 1,
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
    [UPDATE_MESSAGE]: (state, action) => {
      return {
        ...state,
        message: action.payload,
        msgType: action.meta.msgType,
      };
    },
    [UPDATE_GROUPS]: (state, action) => {
      return { ...state, groups: [...action.payload] };
    },
    [UPDATE_ITEM]: (state, action) => {
      return { ...state, items: { ...state.items, ...action.payload } };
    },
    [UPDATE_MODEL]: (state, action) => {
      return { ...state, model: action.payload };
    },
  },
  INITIAL_STATE,
);
