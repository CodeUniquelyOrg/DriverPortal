import { RESET, VALIDATE_SUCCESS } from 'constants/actionTypes';

import ValidateReducer, { isValidated } from 'reducers/ValidateReducer';

// quick comparison for inital state check
const initialState = { validated: false };

/* eslint-disable new-cap */
describe('Validate Reducer', () => {
  //
  test('should return the initial state', () => {
    const state = ValidateReducer(undefined, {});
    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
    expect(isValidated(state)).toEqual(false);
  });

  test('returns a given state', () => {
    const state = ValidateReducer(true, {});
    expect(state).toBeDefined();
    expect(state).toEqual(true);
  });
  //
});

describe('Validate Reducer, RESET', () => {
  //
  test('returns the initial state if action type if RESET is passed', () => {
    const state = ValidateReducer(undefined, { type: RESET });
    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
    expect(isValidated(state)).toEqual(false);
  });
  //
});

describe('Validate Reducer, VALIDATE_SUCCESS', () => {
  //
  test('returns the correct state if action type is VALIDATE_FAILED and undefined state', () => {
    const state = ValidateReducer(undefined, { type: VALIDATE_SUCCESS });
    expect(state).toBeDefined();
    expect(state).toEqual({ validated: true });
    expect(state).toEqual({ validated: true });
  });
  test('returns the correct state if action type is VALIDATE_SUCCESS and state passed in', () => {
    const state = ValidateReducer(true, { type: VALIDATE_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ validated: true });
    expect(isValidated(state)).toEqual(true);
    expect(state).toEqual({ validated: true });
  });
  test('returns the the correct state if just VALIDATE_SUCCESS', () => {
    const state = ValidateReducer({}, { type: VALIDATE_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ validated: true });
  });
  //
});

/* eslint-enable new-cap */
