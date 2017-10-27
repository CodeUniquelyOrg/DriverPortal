//
// ErrorReducer.js TESTS
//
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { RESET, ERROR, EXCEPTION } from 'constants/actionTypes';
import ErrorReducer, { isError, isException } from 'reducers/ErrorReducer';

// quick comparison for inital state check
const initialState = { isError: undefined, isException: undefined };

/* eslint-disable new-cap */
describe('Error Reducer', () => {
  //
  test('should return the initial state', () => {
    const state = ErrorReducer(undefined, {});
    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
  });

  test('returns a given state if action type is not in reducer', () => {
    const state = ErrorReducer(true, { type: 'invalid' });
    expect(state).toBeDefined();
    expect(state).toEqual(true);
  });
  //
});

describe('Error Reducer, RESET', () => {
  //
  test('returns the the correct state', () => {
    const state = ErrorReducer(undefined, { type: RESET });
    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
  });
  test('returns the correct state from isError()', () => {
    const state = { error: ErrorReducer(undefined, { type: RESET }) };
    expect(state).toBeDefined();
    expect(isError(state)).toEqual(false);
  });
  test('returns the correct state from isException()', () => {
    const state = { error: ErrorReducer(undefined, { type: RESET }) };
    expect(state).toBeDefined();
    expect(isException(state)).toEqual(false);
  });
  //
});

describe('Error Reducer, errorOccured', () => {
  //
  test('returns the correct state if action type is ERROR', () => {
    const state = ErrorReducer({}, { type: ERROR });
    expect(state).toBeDefined();
    expect(state).toEqual({ isError: true, isException: false });
  });

  test('returns the correct state from isError() with undefined', () => {
    const state = {
      error: {
      }
    };
    expect(isError(state)).toEqual(false);
  });

  test('returns the correct state from isError() with true', () => {
    const state = {
      error: {
        isError: true,
      }
    };
    expect(isError(state)).toEqual(true);
  });

  test('returns the correct state from isError() with false', () => {
    const state = {
      error: {
        ieError: false,
      }
    };
    expect(isError(state)).toEqual(false);
  });
  //
});

describe('Error Reducer, excptionOccured', () => {
  //
  test('returns the correct state if action type is ERROR', () => {
    const state = ErrorReducer(initialState, { type: EXCEPTION });
    expect(state).toBeDefined();
    expect(state).toEqual({ isError: false, isException: true });
  });
  test('returns the correct state from isError() with undefined', () => {
    const state = {
      error: {
      }
    };
    expect(isException(state)).toEqual(false);
  });
  test('returns the correct state from isError() with true', () => {
    const state = {
      error: {
        isException: true,
      }
    };
    expect(isException(state)).toEqual(true);
  });
  test('returns the correct state from isError() with false', () => {
    const state = {
      error: {
        isException: false,
      }
    };
    expect(isException(state)).toEqual(false);
  });
  //
});

/* eslint-enable new-cap */
