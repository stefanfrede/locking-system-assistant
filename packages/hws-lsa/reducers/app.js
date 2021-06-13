import { handleActions, combineActions } from 'redux-actions';

import {
  HIDE_LOADER,
  SHOW_LOADER,
  HIDE_MODEL_SELECTOR,
  SHOW_MODEL_SELECTOR,
  ADD_GROUP,
  ADD_INNER_LENGTH,
  ADD_ITEM,
  ADD_ITEMS,
  ADD_OUTER_LENGTH,
  DELETE_GROUP,
  DELETE_ITEM,
  DELETE_INNER_LENGTH,
  DELETE_OUTER_LENGTH,
  UPDATE_BUILDS,
  UPDATE_GROUPS,
  UPDATE_ITEM,
  UPDATE_KEY_DETAILS,
  UPDATE_KEY_PRICE,
  UPDATE_LOGIN_STATUS,
  UPDATE_MODEL,
  UPDATE_MODELS,
} from '../actions';

const INITIAL_STATE = {
  builds: [],
  groups: [],
  guard: 3,
  innerLengths: {},
  items: {},
  keys: 5,
  keyPrice: undefined,
  loading: true,
  showCartBtn: false,
  model: 'R9Plus',
  models: [],
  outerLengths: {},
  rows: 5,
  selectable: true,
};

export default handleActions(
  {
    [combineActions(HIDE_LOADER, SHOW_LOADER)]: (state, action) => {
      return { ...state, loading: action.payload };
    },
    [combineActions(HIDE_MODEL_SELECTOR, SHOW_MODEL_SELECTOR)]: (
      state,
      action,
    ) => {
      return { ...state, selectable: action.payload };
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
        rows: action.meta.rows + 1,
      };
    },
    [ADD_ITEMS]: (state, action) => {
      return {
        ...state,
        items: { ...action.payload },
      };
    },
    [ADD_OUTER_LENGTH]: (state, action) => {
      return {
        ...state,
        outerLengths: { ...state.outerLengths, ...action.payload },
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
    [UPDATE_BUILDS]: (state, action) => {
      return { ...state, builds: action.payload };
    },
    [UPDATE_GROUPS]: (state, action) => {
      return { ...state, groups: [...action.payload] };
    },
    [UPDATE_ITEM]: (state, action) => {
      return { ...state, items: { ...state.items, ...action.payload } };
    },
    [UPDATE_KEY_DETAILS]: (state, action) => {
      return { ...state, keyDetails: action.payload };
    },
    [UPDATE_KEY_PRICE]: (state, action) => {
      return { ...state, keyPrice: action.payload };
    },
    [UPDATE_LOGIN_STATUS]: (state, action) => {
      return { ...state, showCartBtn: action.payload };
    },
    [UPDATE_MODEL]: (state, action) => {
      return { ...state, model: action.payload };
    },
    [UPDATE_MODELS]: (state, action) => {
      return { ...state, models: action.payload };
    },
  },
  INITIAL_STATE,
);
