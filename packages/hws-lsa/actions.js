import { createActions } from 'redux-actions';

import {
  getBuilds,
  getDetails,
  getModels,
  getReferences,
} from './lib/products';

import { slugify, uuidv4 } from './lib/helpers';

export const HIDE_LOADER = 'HIDE_LOADER';
export const SHOW_LOADER = 'SHOW_LOADER';
export const LOAD_BUILDS = 'LOAD_BUILDS';
export const LOAD_DETAILS = 'LOAD_DETAILS';
export const LOAD_LENGTHS = 'LOAD_LENGTHS';
export const LOAD_MODELS = 'LOAD_MODELS';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_INNER_LENGTH = 'ADD_INNER_LENGTH';
export const ADD_ITEM = 'ADD_ITEM';
export const ADD_ITEMS = 'ADD_ITEMS';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MODELS = 'ADD_MODELS';
export const ADD_OUTER_LENGTH = 'ADD_OUTER_LENGTH';
export const DELETE_GROUP = 'DELETE_GROUP';
export const DELETE_INNER_LENGTH = 'DELETE_INNER_LENGTH';
export const DELETE_ITEM = 'DELETE_ITEM';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const DELETE_OUTER_LENGTH = 'DELETE_OUTER_LENGTH';
export const UPDATE_BUILDS = 'UPDATE_BUILDS';
export const UPDATE_GROUPS = 'UPDATE_GROUPS';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const UPDATE_MODEL = 'UPDATE_MODEL';
export const UPDATE_MODELS = 'UPDATE_MODELS';

export const {
  hideLoader,
  showLoader,
  loadBuilds,
  loadDetails,
  loadLengths,
  loadModels,
  addGroup,
  addInnerLength,
  addItem,
  addItems,
  addOuterLength,
  deleteGroup,
  deleteInnerLength,
  deleteItem,
  deleteOuterLength,
  updateBuilds,
  updateGroups,
  updateItem,
  updateMessage,
  updateModel,
  updateModels,
} = createActions(
  {
    HIDE_LOADER: () => false,
    SHOW_LOADER: () => true,
    LOAD_BUILDS: [(x) => x, (_, msgType) => ({ msgType })],
    LOAD_LENGTHS: [(x) => x, (_, msgType) => ({ msgType })],
    LOAD_MODELS: [(x) => x, (_, msgType) => ({ msgType })],
    ADD_GROUP: [(x) => x, (_, keys) => ({ keys })],
    ADD_ITEM: [(x) => x, (_, rows) => ({ rows })],
    DELETE_GROUP: [(x) => x, (_, keys) => ({ keys })],
    DELETE_ITEM: [(x) => x, (_, rows) => ({ rows })],
    UPDATE_MESSAGE: [(x) => x, (_, msgType) => ({ msgType })],
    UPDATE_ITEM: [(x) => x, (_, rows) => ({ rows })],
  },
  LOAD_DETAILS,
  ADD_INNER_LENGTH,
  ADD_ITEMS,
  ADD_OUTER_LENGTH,
  DELETE_INNER_LENGTH,
  DELETE_OUTER_LENGTH,
  UPDATE_BUILDS,
  UPDATE_GROUPS,
  UPDATE_MODEL,
  UPDATE_MODELS,
);

export const initAssistant = (keys = 5, rows = 5) => {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        for (let i = 0; i < keys; i++) {
          dispatch(addGroup(0, i + 1));
        }
      })
      .then(() => {
        const {
          app: { groups },
        } = getState();

        for (let i = 0; i < rows; i++) {
          const id = uuidv4();

          dispatch(
            addItem(
              {
                [id]: {
                  name: '',
                  build: '',
                  innerLength: 0,
                  outerLength: 0,
                  quantity: 0,
                  keys: groups.map(Boolean),
                  details: {},
                },
              },
              i,
            ),
          );
        }
      });
  };
};

export const resetAssistant = () => {
  return (dispatch, getState) => {
    dispatch(showLoader());

    const {
      app: { groups, items },
    } = getState();

    const rows = Object.keys(items);

    return Promise.all(groups.map(() => dispatch(deleteKey())))
      .then(() =>
        Promise.all(
          rows.map((id) => {
            dispatch(deleteRow(id));
          }),
        ),
      )
      .then(() => dispatch(initAssistant()))
      .finally(() => dispatch(hideLoader()));
  };
};

export function addKey() {
  return (dispatch, getState) => {
    dispatch(showLoader());

    return Promise.resolve()
      .then(() => {
        const {
          app: { keys },
        } = getState();

        dispatch(addGroup(0, keys + 1));
      })
      .then(() => {
        const {
          app: { items },
        } = getState();

        const rows = Object.keys(items);

        Promise.all(
          rows.map((row) => {
            const item = items[row];
            item.keys.push(false);

            dispatch(updateItem({ [row]: item }));
          }),
        );
      })
      .finally(() => dispatch(hideLoader()));
  };
}

export function deleteKey() {
  return (dispatch, getState) => {
    dispatch(showLoader());

    return Promise.resolve()
      .then(() => {
        const {
          app: { keys },
        } = getState();

        dispatch(deleteGroup(keys - 1, keys - 1));
      })
      .then(() => {
        const {
          app: { items },
        } = getState();

        const rows = Object.keys(items);

        Promise.all(
          rows.map((row) => {
            const item = items[row];
            item.keys.pop();

            dispatch(updateItem({ [row]: item }));
          }),
        );
      })
      .finally(() => dispatch(hideLoader()));
  };
}

export const addRow = () => {
  return (dispatch, getState) => {
    dispatch(showLoader());

    return Promise.resolve()
      .then(() => {
        const {
          app: { groups, items },
        } = getState();

        const id = uuidv4();
        const rows = Object.keys(items);

        dispatch(
          addItem(
            {
              [id]: {
                name: '',
                build: '',
                innerLength: 0,
                outerLength: 0,
                quantity: 0,
                keys: groups.map(() => false),
                details: {},
              },
            },
            rows.length,
          ),
        );
      })
      .finally(() => dispatch(hideLoader()));
  };
};

export function deleteRow(id) {
  return (dispatch, getState) => {
    dispatch(showLoader());

    return Promise.resolve()
      .then(() => {
        const {
          app: { items },
        } = getState();

        const rows = Object.keys(items);
        const row = id ?? rows[rows.length - 1];

        dispatch(deleteItem(row, rows.length));

        return row;
      })
      .then((row) => {
        dispatch(deleteInnerLength(row));

        return row;
      })
      .then((row) => {
        dispatch(deleteOuterLength(row));
      })
      .finally(() => dispatch(hideLoader()));
  };
}

export function fetchBuilds(model) {
  return function (dispatch, getState) {
    dispatch(showLoader());

    const {
      cache: { builds },
    } = getState();

    if (Array.isArray(builds[model])) {
      return Promise.resolve()
        .then(() => {
          dispatch(updateBuilds(builds[model]));

          return builds[model];
        })
        .finally(() => dispatch(hideLoader()));
    }

    return getBuilds(model)
      .then((response) => {
        dispatch(loadBuilds({ [model]: response }));
        dispatch(updateBuilds(response));

        return response;
      })
      .catch((reason) => dispatch(loadBuilds(reason, 'danger')))
      .finally(() => dispatch(hideLoader()));
  };
}

export const fetchDetails = ({ outerLength, id }) => {
  return function (dispatch, getState) {
    dispatch(showLoader());

    const {
      app: { items, model },
      cache: { details },
    } = getState();

    const item = items[id];
    const { build, innerLength } = item;

    const index = slugify(`${model}-${build}-${innerLength}-${outerLength}`);

    item.outerLength = Number(outerLength);
    item.details = details[index];

    return Promise.resolve()
      .then(() => {
        dispatch(updateItem({ [id]: item }));

        return details[index];
      })
      .finally(() => dispatch(hideLoader()));
  };
};

export function fetchModels() {
  return function (dispatch, getState) {
    dispatch(showLoader());

    const {
      cache: { models },
    } = getState();

    if (models.length) {
      return Promise.resolve()
        .then(() => {
          dispatch(loadModels(models));
          dispatch(updateModels(models));
        })
        .finally(() => dispatch(hideLoader()));
    }

    return getModels()
      .then((response) => {
        // sort the response
        const responseSorted = response.sort((a, b) => {
          const itemA = a.toUpperCase(); // ignore upper and lowercase
          const itemB = b.toUpperCase(); // ignore upper and lowercase

          if (itemA < itemB) {
            return -1;
          }

          if (itemA > itemB) {
            return 1;
          }

          // items must be equal
          return 0;
        });

        dispatch(loadModels(responseSorted));
        dispatch(updateModels(responseSorted));
      })
      .catch((reason) => dispatch(loadModels(reason, 'danger')))
      .finally(() => dispatch(hideLoader()));
  };
}

export const fetchInnerLengths = ({ build, id, rewrite = true }) => {
  return async (dispatch, getState) => {
    dispatch(showLoader());

    const {
      app: { items, model },
      cache: { lengths },
    } = getState();

    const item = items[id];

    if (rewrite) {
      item.build = build;
      item.innerLength = 0;
      item.outerLength = 0;
      item.details = {};
    }

    const lengthData = lengths[slugify(`${model}-${build}`)];

    if (lengthData) {
      return Promise.resolve()
        .then(() => {
          if (rewrite) {
            dispatch(updateItem({ [id]: item }));
            dispatch(deleteInnerLength(id));
            dispatch(deleteOuterLength(id));
          }
        })
        .then(() => {
          dispatch(
            addInnerLength({
              [id]: Object.keys(lengthData).map(Number),
            }),
          );

          return Object.keys(lengthData).map(Number);
        })
        .finally(() => dispatch(hideLoader()));
    }

    return getReferences(build, model)
      .then((references) =>
        Promise.all(references.map((reference) => getDetails(reference))),
      )
      .then((items) => {
        const details = {};
        const lengths = {};

        items.forEach((item) => {
          const [{ value: model }] = item.specifications.filter(
            (specification) => specification.name === 'Serie',
          );

          const [{ value: build }] = item.specifications.filter(
            (specification) => specification.name === 'Bauart',
          );

          const [{ value: length }] = item.specifications.filter(
            (specification) => specification.name === 'Teillänge (C+D)',
          );

          const [inner, outer] = length
            .split('+')
            .map((str) => Number(str.trim().replace('mm', '')));

          if (lengths[inner]) {
            lengths[inner].push(outer);
          } else {
            lengths[inner] = [outer];
          }

          details[slugify(`${model}-${build}-${inner}-${outer}`)] = {
            name: item.name,
            price: item.price ?? undefined,
            reference: item.reference,
            subject: item.subject,
            text: item.text,
          };

          if (
            build === 'Doppelzylinder' ||
            build === 'Doppelzylinder mit Not- und Gefahrenfunktion'
          ) {
            if (lengths[outer]) {
              if (!~lengths[outer].indexOf(inner)) {
                lengths[outer].push(inner);
              }
            } else {
              lengths[outer] = [inner];
            }

            details[slugify(`${model}-${build}-${outer}-${inner}`)] = {
              name: item.name,
              price: item.price ?? undefined,
              reference: item.reference,
              subject: item.subject,
              text: item.text,
            };
          }
        });

        dispatch(
          loadLengths({
            [slugify(`${model}-${build}`)]: {
              ...lengths,
            },
          }),
        );

        dispatch(
          loadDetails({
            ...details,
          }),
        );

        return Object.keys(lengths).map(Number);
      })
      .then((innerLengths) => {
        if (rewrite) {
          dispatch(updateItem({ [id]: item }));
          dispatch(deleteInnerLength(id));
          dispatch(deleteOuterLength(id));
        }

        return innerLengths;
      })
      .then((innerLengths) => {
        dispatch(
          addInnerLength({
            [id]: innerLengths,
          }),
        );

        return innerLengths;
      })
      .catch((reason) => dispatch(loadLengths(reason, 'danger')))
      .finally(() => dispatch(hideLoader()));
  };
};

export const fetchOuterLengths = ({ innerLength, id, rewrite = true }) => {
  return (dispatch, getState) => {
    dispatch(showLoader());

    const {
      app: { items, model },
      cache: { lengths },
    } = getState();

    const item = items[id];
    const { build } = item;

    const outerLengths = lengths[slugify(`${model}-${build}`)][
      innerLength
    ].sort((a, b) => a - b);

    if (rewrite) {
      item.innerLength = Number(innerLength);
      item.outerLength = 0;
      item.details = {};
    }

    return Promise.resolve()
      .then(() => {
        if (rewrite) {
          dispatch(updateItem({ [id]: item }));
          dispatch(deleteOuterLength(id));
        }
      })
      .then(() => {
        dispatch(
          addOuterLength({
            [id]: outerLengths,
          }),
        );

        return outerLengths;
      })
      .finally(() => dispatch(hideLoader()));
  };
};

export const reloadData = (model) => {
  return async (dispatch, getState) => {
    dispatch(updateModel(model));

    const builds = await dispatch(fetchBuilds(model));

    const {
      app: { items },
    } = getState();

    const ids = Object.keys(items);

    ids.forEach((id) => {
      const item = items[id];

      if (item.build) {
        if (!~builds.indexOf(item.build)) {
          item.build = '';
          item.innerLength = 0;
          item.outerLength = 0;
          item.details = {};

          dispatch(updateItem({ [id]: item }));
          dispatch(deleteInnerLength(id));
          dispatch(deleteOuterLength(id));
        } else {
          dispatch(
            fetchInnerLengths({
              build: item.build,
              id,
              rewrite: false,
            }),
          ).then((lengths) => {
            if (item.innerLength) {
              if (!~lengths.indexOf(item.innerLength)) {
                item.innerLength = 0;
                item.outerLength = 0;
                item.details = {};

                dispatch(updateItem({ [id]: item }));
                dispatch(deleteInnerLength(id));
                dispatch(deleteOuterLength(id));
                dispatch(
                  addInnerLength({
                    [id]: lengths,
                  }),
                );
              } else {
                dispatch(
                  fetchOuterLengths({
                    innerLength: item.innerLength,
                    id,
                    rewrite: false,
                  }),
                ).then((lengths) => {
                  if (item.outerLength) {
                    if (!~lengths.indexOf(item.outerLength)) {
                      item.outerLength = 0;
                      item.details = {};

                      dispatch(updateItem({ [id]: item }));
                      dispatch(deleteOuterLength(id));
                      dispatch(
                        addOuterLength({
                          [id]: lengths,
                        }),
                      );
                    } else {
                      dispatch(
                        fetchDetails({
                          outerLength: item.outerLength,
                          id,
                        }),
                      ).then((details) => {
                        item.details = details;

                        dispatch(updateItem({ [id]: item }));
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  };
};

export const sortRow = ({ dir, id }) => {
  return async (dispatch, getState) => {
    dispatch(showLoader());

    return Promise.resolve()
      .then(() => {
        const {
          app: { items },
        } = getState();

        const keys = Object.keys(items);
        const index = keys.findIndex((item) => item === id);

        let newIndex = -1;

        // Get the new index
        if (dir === 'up') {
          // Check if item is first in array
          if (index !== 0) {
            newIndex = index - 1;
          }
        } else {
          // Check if item is last in array
          if (index !== keys.length - 1) {
            newIndex = index + 1;
          }
        }

        if (~newIndex) {
          const [item] = keys.splice(index, 1);
          const sortedItems = {};

          keys.splice(newIndex, 0, item);
          keys.forEach((key) => (sortedItems[key] = items[key]));

          dispatch(addItems(sortedItems));
        }
      })
      .finally(() => dispatch(hideLoader()));
  };
};
