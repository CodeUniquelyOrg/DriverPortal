import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import {
  ERROR,
  SPINNER_ON,
  SPINNER_OFF,
  REGISTERED,
  TERMS_ACCEPTED,
  EXCEPTION,
  USER_GET_SUCCESS,
  USER_SET_SUCCESS
} from 'constants/actionTypes';

import {
  NO_CONTENT, UNAUTHORIZED, OK, ACCEPTED
} from 'constants/statusTypes';

import callApi from 'services/apiCaller';
import * as appActions from 'actions/AppActions';
import * as errActions from 'actions/ErrorActions';
import { getUser, setUser } from 'actions/UserActions';

jest.mock('services/apiCaller');

// MOCK wrap the functions
errActions.errorOccurred = jest.fn();
appActions.spinnerOn = jest.fn();
appActions.spinnerOff = jest.fn();
appActions.registered = jest.fn();
appActions.termsAccepted = jest.fn();
errActions.exceptionOccurred = jest.fn();

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

const mockRegisteredData = {
  status: OK,
  json: {
    user: {
      other: {
        registeredUser: true,
      }
    }
  }
};

const mockTermsData = {
  status: OK,
  json: {
    user: {
      other: {
        termsAccepted: true,
      }
    }
  }
};

const mockBothData = {
  status: OK,
  json: {
    user: {
      other: {
        registeredUser: true,
        termsAccepted: true,
      }
    }
  }
};

const mockValidUser = {
  status: ACCEPTED,
  json: {
    user: {
      other: {
        registeredUser: true,
        termsAccepted: true,
      }
    }
  }
};

describe('User Actions', () => {
  // make sure all the mock return the expected value
  beforeEach(() => {
    appActions.spinnerOn.mockClear();
    appActions.spinnerOff.mockClear();
    appActions.registered.mockClear();
    appActions.termsAccepted.mockClear();
    errActions.errorOccurred.mockClear();
    errActions.exceptionOccurred.mockClear();

    appActions.spinnerOn.mockReturnValue({ type: SPINNER_ON });
    appActions.spinnerOff.mockReturnValue({ type: SPINNER_OFF });
    appActions.registered.mockReturnValue({ type: REGISTERED });
    appActions.termsAccepted.mockReturnValue({ type: TERMS_ACCEPTED });
    errActions.errorOccurred.mockReturnValue({ type: ERROR });
    errActions.exceptionOccurred.mockReturnValue({ type: EXCEPTION });
  });

  test('Called getUser OK, should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();
    // console.warn(mockData); // eslint-disable-line no-console

    callApi.mockReturnValueOnce(Promise.resolve(mockBothData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: REGISTERED },
      { type: TERMS_ACCEPTED },
      { type: USER_GET_SUCCESS, json: mockBothData.json }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(getUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.registered).toHaveBeenCalledTimes(1);
        expect(appActions.termsAccepted).toHaveBeenCalledTimes(1);
      });
  });

  test('Called getUser with no content, status NOT OK', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockNoContent));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: ERROR },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(getUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledTimes(1);
        // expect(actions.getSuccess).toHaveBeenCalledTimes(1);
      });
  });

  test('Called getUser with no registered data, status OK', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(getUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        // expect(actions.getSuccess).toHaveBeenCalledTimes(1);
      });
  });

  test('Called getUser with registered no terms, status OK', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockRegisteredData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: REGISTERED },
      { type: USER_GET_SUCCESS, json: mockRegisteredData.json }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(getUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.registered).toHaveBeenCalledTimes(1);
      });
  });

  test('Called getUser with terms no registered, status OK', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockTermsData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: TERMS_ACCEPTED },
      { type: USER_GET_SUCCESS, json: mockTermsData.json }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(getUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.termsAccepted).toHaveBeenCalledTimes(1);
      });
  });

  test('Called getUser generating an exception', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.reject(mockError));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: EXCEPTION },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(getUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.exceptionOccurred).toHaveBeenCalledTimes(1);
      });
  });

  test('Called setUser with no content, status NOT OK', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockNoContent));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: ERROR },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(setUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledTimes(1);
      });
  });

  test('Called setUser with no data, status OK', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: ERROR },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(setUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledTimes(1);
      });
  });

  test('Called setUser with error data, status not OK', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockError));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: ERROR },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(setUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.errorOccurred).toHaveBeenCalledTimes(1);
      });
  });

  test('Called setUser with valid data, status ACCEPTED', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.resolve(mockValidUser));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: USER_SET_SUCCESS, json: mockValidUser.json }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(setUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
      });
  });

  test('Called setUser generating an exception', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore();

    callApi.mockClear();

    callApi.mockReturnValueOnce(Promise.reject(mockError));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: SPINNER_OFF },
      { type: EXCEPTION },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(setUser())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.exceptionOccurred).toHaveBeenCalledTimes(1);
      });
  });

  //
});
