import { createActions } from 'redux-actions';

import { getBuilds, getData, getReferences } from './lib/products';

export const HIDE_LOADER = 'HIDE_LOADER';
export const SHOW_LOADER = 'SHOW_LOADER';
export const LOAD_BUILDS = 'LOAD_BUILDS';
export const LOAD_DATA = 'LOAD_DATA';
export const LOAD_LENGTHS = 'LOAD_LENGTHS';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const UPDATE_MODEL = 'UPDATE_MODEL';
export const UPDATE_LENGTHS = 'UPDATE_LENGTHS';
export const UPDATE_INNER_LENGTHS = 'UPDATE_INNER_LENGTHS';
export const UPDATE_OUTER_LENGTHS = 'UPDATE_OUTER_LENGTHS';
export const UPDATE_SELECTION = 'UPDATE_SELECTION';

export const {
  hideLoader,
  showLoader,
  loadBuilds,
  loadData,
  loadLengths,
  updateMessage,
  updateModel,
  updateInnerLengths,
  updateOuterLengths,
  updateSelection,
} = createActions(
  {
    HIDE_LOADER: () => false,
    SHOW_LOADER: () => true,
    LOAD_BUILDS: [x => x, (_, msgType) => ({ msgType })],
    LOAD_LENGTHS: [x => x, (_, msgType) => ({ msgType })],
    UPDATE_MESSAGE: [x => x, (_, msgType) => ({ msgType })],
  },
  LOAD_DATA,
  UPDATE_MODEL,
  UPDATE_INNER_LENGTHS,
  UPDATE_OUTER_LENGTHS,
  UPDATE_SELECTION,
);

export const adjustTable = ({
  action,
  guard,
  selection,
  selectionItem,
  type,
}) => {
  return ({ dispatch }) => {
    if (type === 'key') {
      dispatch(
        updateSelection(
          selection.map(item => {
            if (action === 'increment') {
              item.keys.push(false);
            } else {
              if (item.keys.length > guard) {
                item.keys = item.keys.slice(0, -1);
              }
            }

            return item;
          }),
        ),
      );
    } else {
      if (action === 'increment') {
        selection.push(selectionItem);
      } else {
        if (selection.length > guard) {
          selection = selection.slice(0, -1);
        }
      }

      dispatch(updateSelection(selection));
    }
  };
};

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
      app: { builds },
    } = getState();

    if (Array.isArray(builds?.model)) {
      dispatch(loadBuilds(builds.model));
    } else {
      try {
        builds = await getBuilds(model);

        dispatch(loadBuilds({ [model]: builds }));
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
      app: { lengths },
    } = getState();

    if ((lengths = lengths[`${model}-${build}`])) {
      fetchInnerLengths(build, model, row)({ dispatch, getState });
      dispatch(hideLoader());
    } else {
      try {
        const references = await getReferences(build, model);

        Promise.all(references.map(reference => getData(reference))).then(
          products => {
            const data = {};
            const lengths = {};

            products.forEach(product => {
              const [{ value: model }] = product.specifications.filter(
                specification => specification.name === 'Serie',
              );

              const [{ value: build }] = product.specifications.filter(
                specification => specification.name === 'Bauart',
              );

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

              data[`${model}-${build}-${inner}-${outer}`] = {
                name: product.name,
                price: product.price ?? undefined,
                reference: product.reference,
                text: product.text,
              };
            });

            dispatch(
              loadLengths({
                [`${model}-${build}`]: {
                  ...lengths,
                },
              }),
            );

            dispatch(
              loadData({
                ...data,
              }),
            );

            fetchInnerLengths(build, model, row)({ dispatch, getState });
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

export const fetchInnerLengths = (build, model, row) => {
  return ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      app: { lengths },
    } = getState();

    const innerLengths = {
      [row]: Object.keys(lengths[`${model}-${build}`]).map(Number),
    };

    dispatch(updateInnerLengths(innerLengths));
    dispatch(hideLoader());
  };
};

export const fetchOuterLengths = (build, model, row, selected) => {
  return ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      app: { lengths },
    } = getState();

    const outerLengths = {
      [row]: lengths[`${model}-${build}`][selected].sort((a, b) => a - b),
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

export const setSelection = selection => {
  return ({ dispatch }) => {
    dispatch(updateSelection(selection));
  };
};
