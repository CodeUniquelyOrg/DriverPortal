// Export Constants
import { REFRESH, SPINNER_ON, SPINNER_OFF, REGISTERED, TERMS_ACCEPTED, LOGGED_IN, LOGGED_OUT } from 'constants/actionTypes';

export function refresh() {
  return {
    type: REFRESH,
  };
}

// Export Actions
export function spinnerOn() {
  return {
    type: SPINNER_ON,
  };
}

export function spinnerOff() {
  return {
    type: SPINNER_OFF,
  };
}

export function registered() {
  return {
    type: REGISTERED,
  };
}

export function termsAccepted() {
  return {
    type: TERMS_ACCEPTED,
  };
}

export function loggedIn() {
  return {
    type: LOGGED_IN,
  };
}

export function loggedOut() {
  return {
    type: LOGGED_OUT,
  };
}
