import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { RESET, SPINNER_ON, SPINNER_OFF, ERROR, EXCEPTION, TERMS_ACCEPTED } from 'constants/actionTypes';
import { UNAUTHORIZED, NO_CONTENT, ACCEPTED } from 'constants/statusTypes';

import * as appActions from 'actions/AppActions';
import * as errActions from 'actions/ErrorActions';
import { accept } from 'actions/termsActions';

import callApi from 'services/apiCaller';

jest.mock('services/apiCaller');

// MOCK wrap the functions
appActions.spinnerOn = jest.fn();
appActions.spinnerOff = jest.fn();
appActions.registered = jest.fn();
errActions.reset = jest.fn();
errActions.errorOccurred = jest.fn();
errActions.exceptionOccurred = jest.fn();
appActions.termsAccepted = jest.fn();

const mockData = {
  status: ACCEPTED,
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
    appActions.termsAccepted.mockClear();
    errActions.reset.mockClear();
    errActions.errorOccurred.mockClear();
    errActions.exceptionOccurred.mockClear();

    appActions.spinnerOn.mockReturnValue({ type: SPINNER_ON });
    appActions.spinnerOff.mockReturnValue({ type: SPINNER_OFF });
    appActions.termsAccepted.mockReturnValue({ type: TERMS_ACCEPTED });
    errActions.reset.mockReturnValue({ type: RESET });
    errActions.errorOccurred.mockReturnValue({ type: ERROR });
    errActions.exceptionOccurred.mockReturnValue({ type: EXCEPTION });
  });

  test('Called with status that is NOT ACCEPTED should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {} });

    callApi.mockReturnValueOnce(Promise.resolve(mockNoContent));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: ERROR },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(accept())
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
    const store = mockStore({ app: {} });

    callApi.mockReturnValueOnce(Promise.resolve(mockData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: TERMS_ACCEPTED }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(accept())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.termsAccepted).toHaveBeenCalledTimes(1);
      });
  });

  test('Catches exceptions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {} });

    callApi.mockReturnValueOnce(Promise.reject(mockError));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: EXCEPTION }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(accept())
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
