import { LOGIN_SUCCESS } from 'constants/actionTypes';

import LoginReducer from 'reducers/LoginReducer';

// quick comparison for inital state check
const initialState = { loggedIn: false };

/* eslint-disable new-cap */
describe('Login Reducer', () => {
  //
  test('should return the initial state', () => {
    const state = LoginReducer(undefined, {});
    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
  });

  test('returns a given state if action type is not in reducer', () => {
    const state = LoginReducer(true, { type: 'invalid' });
    expect(state).toBeDefined();
    expect(state).toEqual(true);
  });
  //
});

describe('Login Reducer, LOGIN_SUCCESS', () => {
  //
  test('returns the correct state if action type is LOGIN_SUCCESS and state passed in', () => {
    const state = LoginReducer(true, { type: LOGIN_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ loggedIn: true });
  });
  test('returns the the correct state if just LOGIN_SUCCESS', () => {
    const state = LoginReducer({}, { type: LOGIN_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ loggedIn: true });
  });
  test('returns the the correct state if LOGIN_SUCCESS and data', () => {
    const state = LoginReducer({}, { type: LOGIN_SUCCESS, data: 'Hello' });
    expect(state).toBeDefined();
    expect(state).toEqual({ loggedIn: true, data: 'Hello' });
  });
  test('returns the the correct state if LOGIN_SUCCESS and error', () => {
    const state = LoginReducer({}, { type: LOGIN_SUCCESS, error: 'was an Error' });
    expect(state).toBeDefined();
    expect(state).toEqual({ loggedIn: true });
  });
  //
});

/* eslint-enable new-cap */
