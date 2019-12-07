/**
 * App
 */
export const ADD_BUILDS = 'ADD_BUILDS';
export const addBuilds = builds => ({
  type: ADD_BUILDS,
  builds,
});

export const ADD_COLUMNS = 'ADD_COLUMNS';
export const addColumns = columns => ({
  type: ADD_COLUMNS,
  columns,
});

export const REMOVE_COLUMNS = 'REMOVE_COLUMNS';
export const removeColumns = columns => ({
  type: REMOVE_COLUMNS,
  columns,
});

export const ADD_ROWS = 'ADD_ROWS';
export const addRows = rows => ({
  type: ADD_ROWS,
  rows,
});

export const REMOVE_ROWS = 'REMOVE_ROWS';
export const removeRows = rows => ({
  type: REMOVE_ROWS,
  rows,
});

export const SHOW_LOADING = 'SHOW_LOADING';
export const showLoading = loading => ({
  type: SHOW_LOADING,
  loading,
});

export const UPDATE_LENGTH = 'UPDATE_LENGTH';
export const updateLength = length => ({
  type: UPDATE_LENGTH,
  length,
});

export const UPDATE_MODEL = 'UPDATE_MODEL';
export const updateModel = model => ({
  type: UPDATE_MODEL,
  model,
});

export const UPDATE_URL = 'UPDATE_URL';
export const updateUrl = url => ({
  type: UPDATE_URL,
  url,
});

/**
 * Cache
 */
export const CACHE_BUILDS = 'CACHE_BUILDS';
export const cacheBuilds = builds => ({
  type: CACHE_BUILDS,
  builds,
});

export const CACHE_LENGTH = 'CACHE_LENGTH';
export const cacheLength = length => ({
  type: CACHE_LENGTH,
  length,
});
