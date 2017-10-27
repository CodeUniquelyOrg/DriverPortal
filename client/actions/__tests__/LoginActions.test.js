// import httpMocks from 'node-mocks-http'; // defines mock request & response object
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { RESET, SPINNER_ON, SPINNER_OFF, ERROR, EXCEPTION, LOGGED_IN, LOGGED_OUT } from 'constants/actionTypes';
import { UNAUTHORIZED, NO_CONTENT, OK } from 'constants/statusTypes';

import callApi from 'services/apiCaller';
import * as appActions from 'actions/AppActions';
import * as errActions from 'actions/ErrorActions';
import * as actions from 'actions/LoginActions';

jest.mock('services/apiCaller');

// MOCK wrap the functions
appActions.errorOccurred = jest.fn();
appActions.spinnerOn = jest.fn();
appActions.spinnerOff = jest.fn();
appActions.loggedIn = jest.fn();
appActions.loggedOut = jest.fn();
errActions.errorOccurred = jest.fn();
errActions.exceptionOccurred = jest.fn();

const mockData = { status: OK, json: {} };
const mockError = {
  status: UNAUTHORIZED,
  json: {
    error: 'unauthorized',
    errorMessage: 'You are unauthorized to make this request',
    err: {}
  },
};

describe('Login Actions', () => {
  //
  beforeEach(() => {
    appActions.spinnerOn.mockClear();
    appActions.spinnerOff.mockClear();
    appActions.loggedIn.mockClear();
    appActions.loggedOut.mockClear();
    errActions.errorOccurred.mockClear();
    errActions.exceptionOccurred.mockClear();

    appActions.spinnerOn.mockReturnValue({ type: SPINNER_ON });
    appActions.spinnerOff.mockReturnValue({ type: SPINNER_OFF });
    appActions.spinnerOn.mockReturnValue({ type: LOGGED_IN });
    appActions.spinnerOff.mockReturnValue({ type: LOGGED_OUT });
    errActions.errorOccurred.mockReturnValue({ type: ERROR });
    errActions.exceptionOccurred.mockReturnValue({ type: EXCEPTION });
  });

  test('Calling Logout should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockReturnValueOnce(Promise.resolve(mockData));

    const expectedActions = [
      { type: LOGGED_OUT },
    ];

    return store.dispatch(actions.logoff())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('Calling with HTTP STATUS.OK should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockReturnValueOnce(Promise.resolve(mockData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: LOGGED_IN },
    ];

    return store.dispatch(actions.login('test@test.com', 'test'))
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
      });
  });

  test('Calling with HTTP UNAUTHORIZED should dispatch error', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockReturnValueOnce(Promise.resolve(mockError));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: ERROR }
    ];

    return store.dispatch(actions.login('test@test.com', 'test'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledTimes(1);
      });
  });

  test('should handle Error thrown', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockReturnValueOnce(Promise.reject('error'));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: EXCEPTION }
    ];

    return store.dispatch(actions.login('test@test.com', 'test'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.exceptionOccurred).toHaveBeenCalledTimes(1);
      });
  });

  //
});
