import {
  REFRESH,
  LOGGED_IN,
  LOGGED_OUT,
  SPINNER_ON,
  SPINNER_OFF,
  REGISTERED,
  TERMS_ACCEPTED,
} from 'constants/actionTypes';

// Initial State
const initialState = {
  refreshed: false,
  spinner: false,
  registered: false,
  termsAccepted: false,
  loggedIn: false,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case REFRESH:
      return {
        ...state,
        refreshed: !state.refreshed || false,
      };
    case SPINNER_ON:
      return {
        ...state,
        spinner: true,
      };
    case SPINNER_OFF:
      return {
        ...state,
        spinner: false,
      };
    case REGISTERED:
      return {
        ...state,
        registered: true,
      };
    case TERMS_ACCEPTED:
      return {
        ...state,
        termsAccepted: true,
      };
    case LOGGED_IN:
      return {
        ...state,
        loggedIn: true,
      };
    case LOGGED_OUT:
      return {
        ...state,
        loggedIn: false,
      };
    default:
      return state;
  }
};

/* Expose Selector Helper functions */

export const isSpinnerOn = state => !!state.app.spinner;

export const isRegistered = state => !!state.app.registered;

export const isLoggedIn = state => !!state.app.loggedIn;

export const areTermsAccepted = state => !!state.app.termsAccepted;

// Export Reducer
export default AppReducer;
