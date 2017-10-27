//
// ErrorReducer.js
//

import { RESET, CLEAR, ERROR, EXCEPTION } from 'constants/actionTypes';

// Initial State
const initialState = { isError: undefined, isException: undefined };

// ==============================================
// type: ERROR,
// status: 401,
// error: 'unauthorized',
// message: 'blah bah blah',
// err: err,
//
// or
//
// type: EXCEPTION,
// status: 500,
// error: 'internalservererror',
// message: message,
// err: err,
// ==============================================

const ErrorReducer = (state = initialState, action) => {
  const { type, ...actionWithoutType } = action;
  switch (action.type) {
    case RESET:
      return {
        // ...state,
        ...initialState,
      };
    case CLEAR:
      return {
        // ...state,
        ...initialState,
        error: undefined,
      };
    case ERROR:
      return {
        ...state,
        ...actionWithoutType,
        isError: true,
        isException: false,
      };
    case EXCEPTION:
      return {
        ...state,
        ...actionWithoutType,
        isError: false,
        isException: true,
      };

    default:
      return state;
  }
};

/* Expose Selector Helper functions */
export const isError = state => !!state.error.isError;
export const isException = state => !!state.error.isException;

// Export Reducer
export default ErrorReducer;
