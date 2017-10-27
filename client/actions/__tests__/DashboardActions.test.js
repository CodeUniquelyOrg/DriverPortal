import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { RESET, SPINNER_ON, SPINNER_OFF, ERROR, EXCEPTION, LATESTDRIVEOVER_SUCCESS, REGISTERED, TERMS_ACCEPTED } from 'constants/actionTypes';
import { UNAUTHORIZED, NO_CONTENT, OK } from 'constants/statusTypes';

import * as appActions from 'actions/AppActions';
import * as errActions from 'actions/ErrorActions';
// import { getLatestDriveOver, success } from 'actions/DashboardActions';
import * as dashActions from 'actions/DashboardActions';

import callApi from 'services/apiCaller';

jest.mock('services/apiCaller');

// MOCK wrap the functions
appActions.spinnerOn = jest.fn();
appActions.spinnerOff = jest.fn();
appActions.registered = jest.fn();
appActions.termsAccepted = jest.fn();
errActions.reset = jest.fn();
errActions.errorOccurred = jest.fn();
errActions.exceptionOccurred = jest.fn();

const mockError = {
  status: UNAUTHORIZED,
  json: {
    error: 'unauthorized',
    message: 'You are unauthorized to make this request',
    err: {}
  },
};

const mockNoContent = { status: NO_CONTENT, json: {} };

const mockData = { status: OK, json: {} };

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

// export function getLatestDriveOver() {
//   return (dispatch) => {
//     dispatch(spinnerOn());

//     dispatch(reset()); // RESET ERRORS / EXCEPTIONS

//     return callApi('driveover/latest')
//       .then(res => {
//         dispatch(spinnerOff());

//         if (res.status !== OK) {
//           return dispatch(errorOccurred(res.status, res.json));
//         }
//         if (res.user && res.user.other) {
//           if (res.user.other.registeredUser) {
//             dispatch(registered());
//           }
//           if (res.user.other.termsAccepted) {
//             dispatch(termsAccepted());
//           }
//         }
//         // pull the json payload from the data
//         dispatch(success(res.json));
//       })
//       .catch(err => {
//         console.error('CRASHED LATEST DRIVEOVER - DASHBOARD ACTIONS'); // eslint-disable-line no-console
//         dispatch(spinnerOff());
//         dispatch(exceptionOccurred(err));
//       });
//   };
// }

describe('Dashboard Actions', () => {
  // make sure all the mock return the expected value
  beforeEach(() => {
    appActions.spinnerOn.mockClear();
    appActions.spinnerOff.mockClear();
    appActions.registered.mockClear();
    appActions.termsAccepted.mockClear();
    errActions.errorOccurred.mockClear();
    errActions.reset.mockClear();
    errActions.exceptionOccurred.mockClear();

    appActions.spinnerOn.mockReturnValue({ type: SPINNER_ON });
    appActions.spinnerOff.mockReturnValue({ type: SPINNER_OFF });
    appActions.registered.mockReturnValue({ type: REGISTERED });
    appActions.termsAccepted.mockReturnValue({ type: TERMS_ACCEPTED });
    errActions.reset.mockReturnValue({ type: RESET });
    errActions.errorOccurred.mockReturnValue({ type: ERROR });
    errActions.exceptionOccurred.mockReturnValue({ type: EXCEPTION });
  });

  //
  test('Called with status that is NOT OK should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {} });

    callApi.mockReturnValueOnce(Promise.resolve(mockNoContent));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: ERROR },
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(dashActions.getLatestDriveOver())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(errActions.reset).toHaveBeenCalledTimes(1);
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
      { type: RESET },
      { type: SPINNER_OFF },
      { type: LATESTDRIVEOVER_SUCCESS, data: {} }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(dashActions.getLatestDriveOver())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(errActions.reset).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        // expect(dashActions.success).toHaveBeenCalledTimes(1);
      });
  });

  test('Called OK and registered user should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {} });

    callApi.mockClear();
    console.warn(mockRegisteredData); // eslint-disable-line no-console

    callApi.mockReturnValueOnce(Promise.resolve(mockRegisteredData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: REGISTERED },
      { type: LATESTDRIVEOVER_SUCCESS, data: mockRegisteredData.json }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(dashActions.getLatestDriveOver())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(errActions.reset).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.registered).toHaveBeenCalledTimes(1);
      });
  });

  test('Called OK and terms accepted user should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {} });

    callApi.mockReturnValueOnce(Promise.resolve(mockTermsData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: TERMS_ACCEPTED },
      { type: LATESTDRIVEOVER_SUCCESS, data: mockTermsData.json }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(dashActions.getLatestDriveOver())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(errActions.reset).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.termsAccepted).toHaveBeenCalledTimes(1);
      });
  });

  test('Called OK and terms accepted user should dispatch expected actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {} });

    callApi.mockReturnValueOnce(Promise.resolve(mockBothData));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: REGISTERED },
      { type: TERMS_ACCEPTED },
      { type: LATESTDRIVEOVER_SUCCESS, data: mockBothData.json }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(dashActions.getLatestDriveOver())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(errActions.reset).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(appActions.registered).toHaveBeenCalledTimes(1);
        expect(appActions.termsAccepted).toHaveBeenCalledTimes(1);
      });
  });

  test('Should handle Exceptions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    // mock the store - as we would expect it to be
    const store = mockStore({ app: {} });

    callApi.mockReturnValueOnce(Promise.reject(mockError));

    const expectedActions = [
      { type: SPINNER_ON },
      { type: RESET },
      { type: SPINNER_OFF },
      { type: EXCEPTION }
    ];

    // could just mock the function and check what it was called with
    return store.dispatch(dashActions.getLatestDriveOver())
      .then(() => {
        // will be a list of all the actions in the order that they were called
        expect(store.getActions()).toEqual(expectedActions);
        expect(appActions.spinnerOn).toHaveBeenCalledTimes(1);
        expect(errActions.reset).toHaveBeenCalledTimes(1);
        expect(appActions.spinnerOff).toHaveBeenCalledTimes(1);
        expect(errActions.exceptionOccurred).toHaveBeenCalledTimes(1);
      });
  });

  //
});
