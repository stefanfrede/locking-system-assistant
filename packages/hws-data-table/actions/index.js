import { createActions } from 'redux-actions';

import { getBuilds, getData, getReferences } from '../lib/products';

export const HIDE_LOADER = 'HIDE_LOADER';
export const SHOW_LOADER = 'SHOW_LOADER';
export const INCREMENT_COLUMNS = 'INCREMENT_COLUMNS';
export const DECRENENT_COLUMNS = 'DECRENENT_COLUMNS';
export const INCREMENT_ROWS = 'INCREMENT_ROWS';
export const DECRENENT_ROWS = 'DECRENENT_ROWS';
export const UPDATE_MODEL = 'UPDATE_MODEL';
export const LOAD_BUILDS = 'LOAD_BUILDS';
export const LOAD_LENGTHS = 'LOAD_LENGTHS';
export const UPDATE_LENGTHS = 'UPDATE_LENGTHS';
export const UPDATE_INNER_LENGTHS = 'UPDATE_INNER_LENGTHS';
export const UPDATE_OUTER_LENGTHS = 'UPDATE_OUTER_LENGTHS';

export const {
  hideLoader,
  showLoader,
  incrementColumns,
  decrementColumns,
  incrementRows,
  decrementRows,
  loadBuilds,
  loadLengths,
  updateModel,
  updateInnerLengths,
  updateOuterLengths,
} = createActions(
  {
    HIDE_LOADER: () => false,
    SHOW_LOADER: () => true,
    INCREMENT_COLUMNS: (amount = 1) => ({ amount }),
    DECRENENT_COLUMNS: (amount = 1) => ({ amount: -amount }),
    INCREMENT_ROWS: (amount = 1) => ({ amount }),
    DECRENENT_ROWS: (amount = 1) => ({ amount: -amount }),
  },
  LOAD_BUILDS,
  LOAD_LENGTHS,
  UPDATE_MODEL,
  UPDATE_INNER_LENGTHS,
  UPDATE_OUTER_LENGTHS,
);

export const fetchBuilds = model => {
  return async dispatch => {
    dispatch(showLoader());

    const builds = await getBuilds(model);

    dispatch(loadBuilds(builds));
    dispatch(hideLoader());
  };
};

export const fetchLengths = (build, model, row) => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    const references = await getReferences(build, model);

    Promise.all(references.map(reference => getData(reference))).then(
      products => {
        const lengths = {};

        products.forEach(product => {
          const [{ value: length }] = product.specifications.filter(
            specification => specification.name === 'Teillänge (C+D)',
          );

          const [inner, outer] = length
            .split('+')
            .map(str => Number(str.trim().replace('mm', '')));

          if (lengths[inner]) {
            lengths[inner].push(outer);
          } else {
            lengths[inner] = [outer];
          }
        });

        dispatch(
          loadLengths({
            [row]: {
              ...lengths,
            },
          }),
        );

        fetchInnerLengths(row)({ dispatch, getState });
        dispatch(hideLoader());
      },
    );
  };
};

export const fetchInnerLengths = row => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      app: { lengths },
    } = getState();

    const innerLengths = {
      [row]: Object.keys(lengths[row]).map(Number),
    };

    dispatch(updateInnerLengths(innerLengths));
    dispatch(hideLoader());
  };
};

export const fetchOuterLengths = (row, selected) => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      app: { lengths },
    } = getState();

    const outerLengths = {
      [row]: lengths[row][selected].sort((a, b) => a - b),
    };

    dispatch(updateOuterLengths(outerLengths));
    dispatch(hideLoader());
  };
};
