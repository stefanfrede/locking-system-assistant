import { createActions } from 'redux-actions';

import { getBuilds, getData, getReferences } from './lib/products';

export const HIDE_LOADER = 'HIDE_LOADER';
export const SHOW_LOADER = 'SHOW_LOADER';
export const INCREMENT_COLUMNS = 'INCREMENT_COLUMNS';
export const DECREMENT_COLUMNS = 'DECREMENT_COLUMNS';
export const INCREMENT_ROWS = 'INCREMENT_ROWS';
export const DECREMENT_ROWS = 'DECREMENT_ROWS';
export const LOAD_BUILDS = 'LOAD_BUILDS';
export const LOAD_LENGTHS = 'LOAD_LENGTHS';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const UPDATE_MODEL = 'UPDATE_MODEL';
export const UPDATE_LENGTHS = 'UPDATE_LENGTHS';
export const UPDATE_INNER_LENGTHS = 'UPDATE_INNER_LENGTHS';
export const UPDATE_OUTER_LENGTHS = 'UPDATE_OUTER_LENGTHS';
export const CACHE_BUILDS = 'CACHE_BUILDS';
export const CACHE_LENGTHS = 'CACHE_LENGTHS';

export const {
  hideLoader,
  showLoader,
  incrementColumns,
  decrementColumns,
  incrementRows,
  decrementRows,
  loadBuilds,
  loadLengths,
  updateMessage,
  updateModel,
  updateInnerLengths,
  updateOuterLengths,
  cacheBuilds,
  cacheLengths,
} = createActions(
  {
    HIDE_LOADER: () => false,
    SHOW_LOADER: () => true,
    INCREMENT_COLUMNS: (amount = 1) => ({ amount }),
    DECREMENT_COLUMNS: (amount = 1) => ({ amount: -amount }),
    INCREMENT_ROWS: (amount = 1) => ({ amount }),
    DECREMENT_ROWS: (amount = 1) => ({ amount: -amount }),
    LOAD_BUILDS: [x => x, (_, msgType) => ({ msgType })],
    LOAD_LENGTHS: [x => x, (_, msgType) => ({ msgType })],
    UPDATE_MESSAGE: [x => x, (_, msgType) => ({ msgType })],
  },
  UPDATE_MODEL,
  UPDATE_INNER_LENGTHS,
  UPDATE_OUTER_LENGTHS,
  CACHE_BUILDS,
  CACHE_LENGTHS,
);

export const dismissMessage = () => {
  return ({ dispatch }) => {
    dispatch(updateMessage('', 'info'));
  };
};

export const fetchBuilds = () => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      app: { model },
    } = getState();

    let {
      cache: { builds },
    } = getState();

    if (builds.model && Array.isArray(builds.model)) {
      dispatch(loadBuilds(builds.model));
    } else {
      try {
        builds = await getBuilds(model);

        dispatch(cacheBuilds({ [model]: builds }));
        dispatch(loadBuilds(builds));
      } catch (err) {
        dispatch(loadBuilds(err, 'danger'));
      }
    }

    dispatch(hideLoader());
  };
};

export const fetchLengths = (build, model, row) => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    let {
      cache: { lengths },
    } = getState();

    if (lengths[`${model}-${build}`]) {
      lengths = lengths[`${model}-${build}`];

      dispatch(
        loadLengths({
          [row]: {
            ...lengths,
          },
        }),
      );

      fetchInnerLengths(row)({ dispatch, getState });
      dispatch(hideLoader());
    } else {
      try {
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
              cacheLengths({
                [`${model}-${build}`]: {
                  ...lengths,
                },
              }),
            );

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
      } catch (err) {
        dispatch(loadLengths(err, 'danger'));
        dispatch(hideLoader());
      }
    }
  };
};

export const fetchInnerLengths = row => {
  return ({ dispatch, getState }) => {
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
  return ({ dispatch, getState }) => {
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

export const resetOuterLength = row => {
  return ({ dispatch }) => {
    const outerLengths = {
      [row]: [],
    };

    dispatch(updateOuterLengths(outerLengths));
  };
};

export const setMessage = (msg, status) => {
  return ({ dispatch }) => {
    dispatch(updateMessage(msg, status));
  };
};
