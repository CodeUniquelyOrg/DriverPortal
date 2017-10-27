// import httpMocks from 'node-mocks-http'; // defines mock request & response object
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { RESET, ERROR, EXCEPTION, SPINNER_ON, SPINNER_OFF, REGISTERED } from 'constants/actionTypes';

import { BAD_REQUEST, CREATED } from 'constants/statusTypes';

import callApi from 'services/apiCaller';
import * as appActions from 'actions/AppActions';
import * as errActions from 'actions/ErrorActions';
import { register } from 'actions/RegisterActions';

jest.mock('services/apiCaller');

// MOCK wrap the functions
appActions.spinnerOn = jest.fn();
appActions.spinnerOff = jest.fn();
appActions.registered = jest.fn();
errActions.errorOccurred = jest.fn();
errActions.exceptionOccurred = jest.fn();

const mockData = { status: CREATED, json: {} };
const mockError = { status: BAD_REQUEST, json: {} };

describe('Register Actions', () => {
  //
  beforeEach(() => {
    appActions.spinnerOn.mockClear();
    appActions.spinnerOff.mockClear();
    appActions.registered.mockClear();
    errActions.errorOccurred.mockClear();
    errActions.exceptionOccurred.mockClear();

    appActions.spinnerOn.mockReturnValue({ type: SPINNER_ON });
    appActions.spinnerOff.mockReturnValue({ type: SPINNER_OFF });
    appActions.registered.mockReturnValue({ type: REGISTERED });
    errActions.errorOccurred.mockReturnValue({ type: ERROR });
    errActions.exceptionOccurred.mockReturnValue({ type: EXCEPTION });
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
      { type: REGISTERED }
    ];

    // could just mock the function and check what it was called with

    return store.dispatch(register('test', 'user', 'test@test.com', 'password'))
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.registered).toHaveBeenCalledTimes(1);
      });
  });

  test('Calling with HTTP not STATUS.OK should dispatch error', () => {
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

    return store.dispatch(register('test', 'user', 'test@test.com', 'password'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledTimes(1);
      });
  });

  test('should handle Exceptions / throws', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    appActions.spinnerOn.mockReturnValue({ type: SPINNER_ON });
    appActions.spinnerOff.mockReturnValue({ type: SPINNER_OFF });

    callApi.mockReturnValueOnce(Promise.reject('error'));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: EXCEPTION }
    ];

    return store.dispatch(register('test', 'user', 'test@test.com', 'password'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.exceptionOccurred).toHaveBeenCalledTimes(1);
      });
  });

  //
});
