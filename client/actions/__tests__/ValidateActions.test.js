import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { RESET, SPINNER_ON, SPINNER_OFF, ERROR, EXCEPTION, USER_GET_SUCCESS, VALIDATE_SUCCESS } from 'constants/actionTypes';
import { UNAUTHORIZED, NO_CONTENT, OK } from 'constants/statusTypes';

import * as appActions from 'actions/AppActions';
import * as errActions from 'actions/ErrorActions';
import * as usrActions from 'actions/UserActions';
import { validateCode } from 'actions/ValidateActions';

import callApi from 'services/apiCaller';

jest.mock('services/apiCaller');

// MOCK wrap the functions
appActions.spinnerOn = jest.fn();
appActions.spinnerOff = jest.fn();
appActions.registered = jest.fn();
errActions.reset = jest.fn();
errActions.errorOccurred = jest.fn();
errActions.exceptionOccurred = jest.fn();
usrActions.getUser = jest.fn();

const mockData = {
  status: OK,
  json: {}
};

const mockNoContent = {
  status: NO_CONTENT,
  json: {}
};

const mockError = {
  status: UNAUTHORIZED,
  json: {
    error: 'unauthorized',
    errorMessage: 'You are unauthorized to make this request',
    err: {}
  },
};

describe('Terms Actions', () => {
  //
  beforeEach(() => {
    appActions.spinnerOn.mockClear();
    appActions.spinnerOff.mockClear();
    errActions.reset.mockClear();
    errActions.errorOccurred.mockClear();
    errActions.exceptionOccurred.mockClear();
    usrActions.getUser.mockClear();

    appActions.spinnerOn.mockReturnValue({ type: SPINNER_ON });
    appActions.spinnerOff.mockReturnValue({ type: SPINNER_OFF });
    errActions.reset.mockReturnValue({ type: RESET });
    errActions.errorOccurred.mockReturnValue({ type: ERROR });
    errActions.exceptionOccurred.mockReturnValue({ type: EXCEPTION });
    usrActions.getUser.mockReturnValue({ type: USER_GET_SUCCESS });
  });

  test('Called with status that is NOT ACCEPTED should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {}, validate: {} });

    callApi.mockReturnValueOnce(Promise.resolve(mockNoContent));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: ERROR },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(validateCode())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledWith(NO_CONTENT, {});
      });
  });

  test('Calling with HTTP STATUS.OK should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {}, validate: {} });

    callApi.mockReturnValueOnce(Promise.resolve(mockData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: USER_GET_SUCCESS },
      { type: VALIDATE_SUCCESS }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(validateCode())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(usrActions.getUser).toHaveBeenCalledTimes(1);
      });
  });

  test('Catches exceptions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {}, validate: {} });

    callApi.mockReturnValueOnce(Promise.reject(mockError));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: EXCEPTION }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(validateCode())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.exceptionOccurred).toHaveBeenCalledTimes(1);
        expect(errActions.exceptionOccurred).toHaveBeenCalledWith(mockError);
      });
  });

  //
});
