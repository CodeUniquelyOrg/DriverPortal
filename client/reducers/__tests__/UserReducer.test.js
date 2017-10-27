import { USER_GET_SUCCESS, USER_SET_SUCCESS } from 'constants/actionTypes';

import UserReducer from 'reducers/UserReducer';

// quick comparison for inital state check
const initialState = {};

/* eslint-disable new-cap */
describe('User Reducer', () => {
  //
  test('should return the initial state', () => {
    const state = UserReducer(undefined, {});
    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
  });

  test('returns a given state', () => {
    const state = UserReducer(true, {});
    expect(state).toBeDefined();
    expect(state).toEqual(true);
  });
  //
});

describe('User Reducer, USER_GET_SUCCESS', () => {
  //
  test('returns the correct state if action type is USER_GET_SUCCESS and undefined state', () => {
    const state = UserReducer(undefined, { type: USER_GET_SUCCESS });
    expect(state).toBeDefined();
    expect(state).toEqual({ user: undefined });
  });
  test('returns the correct state if action type is USER_GET_SUCCESS and state passed in', () => {
    const state = UserReducer(true, { type: USER_GET_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ user: undefined });
  });
  test('returns the the correct state if just USER_GET_SUCCESS', () => {
    const state = UserReducer({}, { type: USER_GET_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ user: undefined });
  });
  test('returns the the correct state if USER_GET_SUCCESS and data', () => {
    const state = UserReducer({}, { type: USER_GET_SUCCESS, user: { foreName: 'test', lastName: 'user' } });
    expect(state).toBeDefined();
    expect(state).toEqual({ user: { foreName: 'test', lastName: 'user' } });
  });
  test('returns the the correct state if USER_GET_SUCCESS and error', () => {
    const state = UserReducer({}, { type: USER_GET_SUCCESS, error: 'was an Error' });
    expect(state).toBeDefined();
    expect(state).toEqual({ user: undefined });
  });
  //
});

describe('User Reducer, USER_SET_SUCCESS', () => {
  //
  test('returns the correct state if action type is USER_SET_SUCCESS and undefined state', () => {
    const state = UserReducer(undefined, { type: USER_SET_SUCCESS });
    expect(state).toBeDefined();
    expect(state).toEqual({ userUpdated: true });
  });
  test('returns the correct state if action type is USER_SET_SUCCESS and state passed in', () => {
    const state = UserReducer(true, { type: USER_SET_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ userUpdated: true });
  });
  test('returns the the correct state if just USER_SET_SUCCESS', () => {
    const state = UserReducer({}, { type: USER_SET_SUCCESS, });
    expect(state).toBeDefined();
    expect(state).toEqual({ userUpdated: true });
  });
  test('returns the the correct state if USER_SET_SUCCESS and data', () => {
    const state = UserReducer({}, { type: USER_SET_SUCCESS, user: { foreName: 'test', lastName: 'user' } });
    expect(state).toBeDefined();
    expect(state).toEqual({ userUpdated: true, user: { foreName: 'test', lastName: 'user' } });
  });
  //
});


/* eslint-enable new-cap */
