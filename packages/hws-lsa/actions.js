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
export const LOAD_DETAILS = 'LOAD_DETAILS';
export const LOAD_LENGTHS = 'LOAD_LENGTHS';
export const ADD_BUILDS = 'ADD_BUILDS';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_INNER_LENGTH = 'ADD_INNER_LENGTH';
export const ADD_ITEM = 'ADD_ITEM';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MODELS = 'ADD_MODELS';
export const ADD_OUTER_LENGTH = 'ADD_OUTER_LENGTH';
export const DELETE_GROUP = 'DELETE_GROUP';
export const DELETE_INNER_LENGTH = 'DELETE_INNER_LENGTH';
export const DELETE_ITEM = 'DELETE_ITEM';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const DELETE_OUTER_LENGTH = 'DELETE_OUTER_LENGTH';
export const UPDATE_GROUPS = 'UPDATE_GROUPS';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const UPDATE_MODEL = 'UPDATE_MODEL';
export const UPDATE_LENGTHS = 'UPDATE_LENGTHS';

export const {
  hideLoader,
  showLoader,
  loadDetails,
  loadLengths,
  addBuilds,
  addGroup,
  addInnerLength,
  addItem,
  addModels,
  addOuterLength,
  deleteGroup,
  deleteInnerLength,
  deleteItem,
  deleteOuterLength,
  updateGroups,
  updateItem,
  updateMessage,
  updateModel,
} = createActions(
  {
    HIDE_LOADER: () => false,
    SHOW_LOADER: () => true,
    LOAD_LENGTHS: [x => x, (_, msgType) => ({ msgType })],
    ADD_BUILDS: [x => x, (_, msgType) => ({ msgType })],
    ADD_GROUP: [x => x, (_, keys) => ({ keys })],
    ADD_ITEM: [x => x, (_, index, rows) => ({ index, rows })],
    ADD_MODELS: [x => x, (_, msgType) => ({ msgType })],
    DELETE_GROUP: [x => x, (_, keys) => ({ keys })],
    DELETE_ITEM: [x => x, (_, index, rows) => ({ index, rows })],
    UPDATE_MESSAGE: [x => x, (_, msgType) => ({ msgType })],
    UPDATE_ITEM: [x => x, (_, index, rows) => ({ index, rows })],
  },
  LOAD_DETAILS,
  ADD_INNER_LENGTH,
  ADD_OUTER_LENGTH,
  DELETE_INNER_LENGTH,
  DELETE_OUTER_LENGTH,
  UPDATE_GROUPS,
  UPDATE_MODEL,
);

export const initApp = (keys = 5, rows = 5) => {
  return ({ dispatch, getState }) => {
    for (let i = 0; i < keys; i++) {
      dispatch(addGroup(0, i + 1));
    }

    for (let i = 0; i < rows; i++) {
      const {
        app: { groups },
      } = getState();

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
          id,
          i,
        ),
      );
    }
  };
};

export const resetApp = model => {
  return ({ dispatch, getState }) => {
    const {
      app: { groups, rowIds },
    } = getState();

    groups.forEach(() => {
      deleteKey()({ dispatch, getState });
    });

    rowIds.forEach(rowId => {
      dispatch(deleteInnerLength(rowId));
      dispatch(deleteOuterLength(rowId));

      deleteRow()({ dispatch, getState });
    });

    initApp()({ dispatch, getState });

    dispatch(updateModel(model));

    fetchBuilds(model)({ dispatch, getState });
  };
};

export const addKey = () => {
  return ({ dispatch, getState }) => {
    const {
      app: { items, keys, rowIds },
    } = getState();

    dispatch(addGroup(0, keys + 1));

    rowIds.forEach(rowId => {
      const item = items[rowId];
      item.keys.push(false);

      dispatch(updateItem({ [rowId]: item }));
    });
  };
};

export const deleteKey = () => {
  return ({ dispatch, getState }) => {
    const {
      app: { items, keys, rowIds },
    } = getState();

    dispatch(deleteGroup(keys - 1, keys - 1));

    rowIds.forEach(rowId => {
      const item = items[rowId];
      item.keys.pop();

      dispatch(updateItem({ [rowId]: item }));
    });
  };
};

export const addRow = () => {
  return ({ dispatch, getState }) => {
    const {
      app: { groups, rows },
    } = getState();

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
            keys: groups.map(() => false),
            details: {},
          },
        },
        id,
        rows,
      ),
    );
  };
};

export const deleteRow = id => {
  return ({ dispatch, getState }) => {
    const {
      app: { rowIds, rows },
    } = getState();

    const rowId = id ?? rowIds[rows - 1];
    const index = rowIds.indexOf(rowId);

    dispatch(deleteItem(rowId, index, rows));
    dispatch(deleteInnerLength(rowId));
    dispatch(deleteOuterLength(rowId));
  };
};

function collectDetails(payload) {
  const details = {};
  const lengths = {};

  payload.forEach(data => {
    const [{ value: model }] = data.specifications.filter(
      specification => specification.name === 'Serie',
    );

    const [{ value: build }] = data.specifications.filter(
      specification => specification.name === 'Bauart',
    );

    const [{ value: length }] = data.specifications.filter(
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

    details[slugify(`${model}-${build}-${inner}-${outer}`)] = {
      name: data.name,
      price: data.price ?? undefined,
      reference: data.reference,
      subject: data.subject,
      text: data.text,
    };
  });

  return {
    details,
    lengths,
  };
}

//
// TODO refactor this awful code!!!
//
export const cacscadeData = model => {
  return async ({ dispatch, getState }) => {
    let {
      app: { builds, items },
    } = getState();

    const {
      cache: { details, lengths },
    } = getState();

    dispatch(showLoader());
    dispatch(updateModel(model));

    // Get builds for the model
    builds = Array.isArray(builds?.[model])
      ? builds[model]
      : await getBuilds(model);

    // loop through data
    for (let [id, item] of Object.entries(items)) {
      const build = item.build;
      const hasBuild = !!~builds.indexOf(build);

      if (hasBuild) {
        const hasLength = lengths[slugify(`${model}-${build}`)];

        if (hasLength) {
          const lengths = hasLength;

          const innerLengths = Object.keys(lengths).map(Number);
          const hasInnerLength = !!~innerLengths.indexOf(item.innerLength);

          dispatch(addBuilds({ [model]: builds }));

          if (hasInnerLength) {
            dispatch(addInnerLength({ [id]: innerLengths }));

            const outerLengths = lengths[item.innerLength].sort(
              (a, b) => a - b,
            );

            const hasOuterLength = !!~outerLengths.indexOf(item.outerLength);

            if (hasOuterLength) {
              dispatch(addOuterLength({ [id]: outerLengths }));

              item.details =
                details[
                  slugify(
                    `${model}-${build}-${item.innerLength}-${item.outerLength}`,
                  )
                ];

              dispatch(updateItem({ [id]: item }));
              dispatch(hideLoader());
            } else {
              item.outerLength = 0;
              item.details = {};

              dispatch(updateItem({ [id]: item }));
              dispatch(deleteOuterLength(id));

              setTimeout(() => {
                dispatch(addOuterLength({ [id]: outerLengths }));
                dispatch(hideLoader());
              }, 500);
            }
          } else {
            item.innerLength = 0;
            item.outerLength = 0;
            item.details = {};

            dispatch(updateItem({ [id]: item }));
            dispatch(deleteInnerLength(id));
            dispatch(deleteOuterLength(id));

            setTimeout(() => {
              dispatch(addInnerLength({ [id]: innerLengths }));
              dispatch(hideLoader());
            }, 500);
          }
        } else {
          const references = await getReferences(build, model);

          Promise.all(references.map(reference => getDetails(reference))).then(
            payload => {
              const { details, lengths } = collectDetails(payload);

              const innerLengths = Object.keys(lengths).map(Number);
              const hasInnerLength = !!~innerLengths.indexOf(item.innerLength);

              dispatch(addBuilds({ [model]: builds }));

              if (hasInnerLength) {
                dispatch(addInnerLength({ [id]: innerLengths }));

                const outerLengths = lengths[item.innerLength].sort(
                  (a, b) => a - b,
                );

                const hasOuterLength = !!~outerLengths.indexOf(
                  item.outerLength,
                );

                if (hasOuterLength) {
                  dispatch(addOuterLength({ [id]: outerLengths }));

                  item.details =
                    details[
                      slugify(
                        `${model}-${build}-${item.innerLength}-${item.outerLength}`,
                      )
                    ];

                  dispatch(updateItem({ [id]: item }));
                  dispatch(hideLoader());
                } else {
                  item.outerLength = 0;
                  item.details = {};

                  dispatch(updateItem({ [id]: item }));
                  dispatch(deleteOuterLength(id));

                  setTimeout(() => {
                    dispatch(addOuterLength({ [id]: outerLengths }));
                    dispatch(hideLoader());
                  }, 500);
                }
              } else {
                item.innerLength = 0;
                item.outerLength = 0;
                item.details = {};

                dispatch(updateItem({ [id]: item }));
                dispatch(deleteInnerLength(id));
                dispatch(deleteOuterLength(id));

                setTimeout(() => {
                  dispatch(addInnerLength({ [id]: innerLengths }));
                  dispatch(hideLoader());
                }, 500);
              }

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
            },
          );
        }
      } else {
        const item = items[id];

        item.build = '';
        item.innerLength = 0;
        item.outerLength = 0;
        item.details = {};

        dispatch(addBuilds({ [model]: builds }));
        dispatch(updateItem({ [id]: item }));
        dispatch(deleteInnerLength(id));
        dispatch(deleteOuterLength(id));

        dispatch(hideLoader());
      }
    }
  };
};

export const fetchBuilds = model => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    let {
      app: { builds },
    } = getState();

    if (Array.isArray(builds?.[model])) {
      dispatch(addBuilds({ [model]: builds[model] }));
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

export const fetchDetails = ({ build, model, innerLength, outerLength }) => {
  return ({ getState }) => {
    const {
      cache: { details },
    } = getState();

    return details[slugify(`${model}-${build}-${innerLength}-${outerLength}`)];
  };
};

export const fetchInnerLengths = (build, model, rowId) => {
  return ({ dispatch, getState }) => {
    dispatch(showLoader());

    const {
      cache: { lengths },
    } = getState();

    const innerLengths = {
      [rowId]: Object.keys(lengths[slugify(`${model}-${build}`)]).map(Number),
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
      [rowId]: lengths[slugify(`${model}-${build}`)][innerLength].sort(
        (a, b) => a - b,
      ),
    };

    dispatch(addOuterLength(outerLengths));
    dispatch(hideLoader());
  };
};

export const fetchModels = () => {
  return async ({ dispatch, getState }) => {
    dispatch(showLoader());

    let {
      app: { models },
    } = getState();

    if (!models.length) {
      try {
        const [iseo, gera] = await getModels();

        dispatch(addModels(iseo.concat(gera)));
      } catch (err) {
        dispatch(addModels(err, 'danger'));
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

    const hasLength = lengths[slugify(`${model}-${build}`)];

    if (hasLength) {
      fetchInnerLengths(build, model, rowId)({ dispatch, getState });
      dispatch(hideLoader());
    } else {
      try {
        const references = await getReferences(build, model);

        Promise.all(references.map(reference => getDetails(reference))).then(
          payload => {
            const { details, lengths } = collectDetails(payload);

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
