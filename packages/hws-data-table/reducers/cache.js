import { CACHE_BUILDS, CACHE_LENGTH } from '../actions';

const INITIAL_STATE = {
  length: {},
  builds: {},
};

const app = (state = INITIAL_STATE, action = null) => {
  switch (action.type) {
    case CACHE_BUILDS:
      return {
        ...state,
        builds: { ...state.builds, ...action.builds },
      };
    case CACHE_LENGTH:
      return {
        ...state,
        length: { ...state.length, ...action.length },
      };
    default:
      return state;
  }
};

export default app;
