import { createActions } from 'redux-actions';

import { getBuilds, getDetails, getReferences } from './lib/products';

export const HIDE_LOADER = 'HIDE_LOADER';
export const SHOW_LOADER = 'SHOW_LOADER';
export const ADD_BUILDS = 'ADD_BUILDS';
export const ADD_DETAILS = 'ADD_DETAILS';
export const DELETE_DETAILS = 'DELETE_DETAILS';
export const ADD_GROUP = 'ADD_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const UPDATE_GROUPS = 'UPDATE_GROUPS';
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const ADD_INNER_LENGTH = 'ADD_INNER_LENGTH';
export const DELETE_INNER_LENGTH = 'DELETE_INNER_LENGTH';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const ADD_OUTER_LENGTH = 'ADD_OUTER_LENGTH';
export const DELETE_OUTER_LENGTH = 'DELETE_OUTER_LENGTH';
export const ADD_ROW_ID = 'ADD_ROW_ID';
export const DELETE_ROW_ID = 'DELETE_ROW_ID';
export const LOAD_DETAILS = 'LOAD_DETAILS';
export const LOAD_LENGTHS = 'LOAD_LENGTHS';
export const LOAD_MODELS = 'LOAD_MODELS';
export const UPDATE_MODEL = 'UPDATE_MODEL';
export const UPDATE_LENGTHS = 'UPDATE_LENGTHS';

export const {
  hideLoader,
  showLoader,
  addBuilds,
  addDetails,
  deleteDetails,
  addGroup,
  deleteGroup,
  updateGroups,
  addItem,
  deleteItem,
  updateItem,
  addInnerLength,
  deleteInnerLength,
  addOuterLength,
  deleteOuterLength,
  addRowId,
  deleteRowId,
  loadDetails,
  loadLengths,
  loadModels,
  updateMessage,
  updateModel,
} = createActions(
  {
    HIDE_LOADER: () => false,
    SHOW_LOADER: () => true,
    ADD_GROUP: [x => x, (_, keys) => ({ keys })],
    DELETE_GROUP: [x => x, (_, keys) => ({ keys })],
    ADD_ROW_ID: [x => x, (_, rows) => ({ rows })],
    DELETE_ROW_ID: [x => x, (_, rows) => ({ rows })],
    ADD_BUILDS: [x => x, (_, msgType) => ({ msgType })],
    LOAD_LENGTHS: [x => x, (_, msgType) => ({ msgType })],
    LOAD_MODELS: [x => x, (_, msgType) => ({ msgType })],
    UPDATE_MESSAGE: [x => x, (_, msgType) => ({ msgType })],
  },
  ADD_DETAILS,
  DELETE_DETAILS,
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
  ADD_INNER_LENGTH,
  DELETE_INNER_LENGTH,
  ADD_OUTER_LENGTH,
  DELETE_OUTER_LENGTH,
  LOAD_DETAILS,
  UPDATE_GROUPS,
  UPDATE_MODEL,
);

export const fetchBuilds = model => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    let {
      app: { builds },
    } = getState();

    if (Array.isArray(builds?.model)) {
      dispatch(addBuilds({ [model]: builds.model }));
    } else {
      try {
        builds = await getBuilds(model);

        dispatch(addBuilds({ [model]: builds }));
      } catch (err) {
        dispatch(addBuilds(err, 'danger'));
      }
    }

    dispatch(hideLoader());
  };
};

export const fetchLengths = (build, model, rowId) => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    let {
      cache: { lengths },
    } = getState();

    if ((lengths = lengths[`${model}-${build}`])) {
      fetchInnerLengths(build, model, rowId)({ dispatch, getState });
      dispatch(hideLoader());
    } else {
      try {
        const references = await getReferences(build, model);

        Promise.all(references.map(reference => getDetails(reference))).then(
          products => {
            const details = {};
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

              details[`${model}-${build}-${inner}-${outer}`] = {
                name: product.name,
                price: product.price ?? undefined,
                reference: product.reference,
                subject: product.subject,
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
              loadDetails({
                ...details,
              }),
            );

            fetchInnerLengths(build, model, rowId)({ dispatch, getState });
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

export const fetchInnerLengths = (build, model, rowId) => {
  return ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      cache: { lengths },
    } = getState();

    const innerLengths = {
      [rowId]: Object.keys(lengths[`${model}-${build}`]).map(Number),
    };

    dispatch(addInnerLength(innerLengths));
    dispatch(hideLoader());
  };
};

export const fetchOuterLengths = (build, model, rowId, innerLength) => {
  return ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      cache: { lengths },
    } = getState();

    const outerLengths = {
      [rowId]: lengths[`${model}-${build}`][innerLength].sort((a, b) => a - b),
    };

    dispatch(addOuterLength(outerLengths));
    dispatch(hideLoader());
  };
};

export const fetchDetails = ({
  build,
  model,
  innerLength,
  outerLength,
  rowId,
}) => {
  return ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      cache: { details },
    } = getState();

    dispatch(
      addDetails({
        [rowId]: details[`${model}-${build}-${innerLength}-${outerLength}`],
      }),
    );
    dispatch(hideLoader());
  };
};
