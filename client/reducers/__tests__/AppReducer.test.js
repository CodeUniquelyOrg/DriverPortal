//
// AppReducer.js TEST
//

import { LOGGED_IN, LOGGED_OUT, SPINNER_ON, SPINNER_OFF, REGISTERED, TERMS_ACCEPTED } from 'constants/actionTypes';
// import { spinnerOn, spinnerOff, registered, termsAccepted, loggedIn, loggedOut } from 'actions/AppActions';
import AppReducer, { isLoggedIn, isSpinnerOn, isRegistered, areTermsAccepted } from 'reducers/AppReducer';

// quick comparison for inital state check
const initialState = {
  spinner: false,
  registered: false,
  termsAccepted: false,
  loggedIn: false,
};

/* eslint-disable new-cap */
describe('App Reducer', () => {
  //
  test('should return the initial state', () => {
    const state = AppReducer(undefined, {});
    expect(state).toBeDefined();
    expect(state).toEqual(initialState);
  });

  test('returns a given state if action type is not in reducer', () => {
    const state = AppReducer(true, { type: 'invalid' });
    expect(state).toBeDefined();
    expect(state).toEqual(true);
  });
  //
});

describe('App Reducer, isLoggedIn', () => {
  //
  test('returns the the correct state if action type is LOGGED_IN', () => {
    const state = AppReducer({}, { type: LOGGED_IN });
    expect(state).toBeDefined();
    expect(state).toEqual({ loggedIn: true });
  });
  test('returns the correct state if action type is LOGGED_OUT', () => {
    const state = AppReducer({}, { type: LOGGED_OUT });
    expect(state).toBeDefined();
    expect(state).toEqual({ loggedIn: false });
  });
  test('returns the correct state from isLoggedIn() with undefined', () => {
    const state = {
      app: {
      }
    };
    expect(isLoggedIn(state)).toEqual(false);
  });
  test('returns the correct state from isLoggedIn() with true', () => {
    const state = {
      app: {
        loggedIn: true,
      }
    };
    expect(isLoggedIn(state)).toEqual(true);
  });
  test('returns the correct state from isLoggedIn() with false', () => {
    const state = {
      app: {
        loggedIn: false,
      }
    };
    expect(isLoggedIn(state)).toEqual(false);
  });
  //
});

describe('App Reducer, isSpinnerOn', () => {
  //
  test('returns the correct state if action type is SPINNER_ON', () => {
    const state = AppReducer({}, { type: SPINNER_ON });
    expect(state).toBeDefined();
    expect(state).toEqual({ spinner: true });
  });
  test('returns the correct state if action type is SPINNER_OFF', () => {
    const state = AppReducer({}, { type: SPINNER_OFF });
    expect(state).toBeDefined();
    expect(state).toEqual({ spinner: false });
  });
  test('returns the correct state from isSpinnerOn() with undefined', () => {
    const state = {
      app: {
      }
    };
    expect(isSpinnerOn(state)).toEqual(false);
  });
  test('returns the correct state from isSpinnerOn() with true', () => {
    const state = {
      app: {
        spinner: true,
      }
    };
    expect(isSpinnerOn(state)).toEqual(true);
  });
  test('returns the correct state from isSpinnerOn() with false', () => {
    const state = {
      app: {
        spinner: false,
      }
    };
    expect(isSpinnerOn(state)).toEqual(false);
  });
  //
});

describe('App Reducer, isRegistered', () => {
  //
  test('returns correct state isRegistered state if type is REGISTERED', () => {
    const state = AppReducer({}, { type: REGISTERED });
    expect(state).toBeDefined();
    expect(state).toEqual({ registered: true });
  });
  test('returns the correct state from isRegistered() with undefined', () => {
    const state = {
      app: {
      }
    };
    expect(isRegistered(state)).toEqual(false);
  });
  test('returns the correct state from isRegistered() with true', () => {
    const state = {
      app: {
        registered: true,
      }
    };
    expect(isRegistered(state)).toEqual(true);
  });
  test('returns the correct state from isRegsitered() with false', () => {
    const state = {
      app: {
        registered: false,
      }
    };
    expect(isRegistered(state)).toEqual(false);
  });
  //
});

describe('App Reducer, areTermsAccepted', () => {
  //
  test('rreturns correct state areTermsAccepted state if action type is TERMS_ACCEPTED', () => {
    const state = AppReducer({}, { type: TERMS_ACCEPTED });
    expect(state).toBeDefined();
    expect(state).toEqual({ termsAccepted: true });
  });
  test('returns the correct state from areTermsAccepted() with undefined', () => {
    const state = {
      app: {
      }
    };
    expect(areTermsAccepted(state)).toEqual(false);
  });
  test('returns the correct state from areTermsAccepted() with true', () => {
    const state = {
      app: {
        termsAccepted: true,
      }
    };
    expect(areTermsAccepted(state)).toEqual(true);
  });
  test('returns the correct state from areTermsAccepted() with false', () => {
    const state = {
      app: {
        termsAccepted: false,
      }
    };
    expect(areTermsAccepted(state)).toEqual(false);
  });

  //
});
/* eslint-enable new-cap */
