//
// LoginActions.js
//

import { OK } from 'constants/statusTypes';
import { reset, errorOccurred, exceptionOccurred } from 'actions/ErrorActions';
import { refresh, spinnerOn, spinnerOff, loggedIn, loggedOut } from 'actions/AppActions';
import { getUser } from 'actions/UserActions';
import { logIn, logOut } from 'services/tokens';

import callApi from 'services/apiCaller';

// =======================================
// uses 'isomorphic-fetch' => callApi
// =======================================
export function logoff() {
  return (dispatch) => {
    logOut();
    console.log('LOGOFF - LOGGED OUT'); // eslint-disable-line no-console
    dispatch(loggedOut());
  };
}

export function login(email, password) {
  return (dispatch) => {
    dispatch(spinnerOn());

    // reset error conditions
    dispatch(reset());

    return callApi('auth/login', 'post', { email, password })
      .then(res => {
        dispatch(spinnerOff());
        if (res.status !== OK) {
          console.error('ERROR LOGIN - NOT OK'); // eslint-disable-line no-console
          return dispatch(errorOccurred(res.status, res.json));
        }

        logIn();

        console.log('LOGIN - LOGGED IN'); // eslint-disable-line no-console
        dispatch(loggedIn());

        console.log('LOGIN - REFRESH USER'); // eslint-disable-line no-console
        dispatch(getUser());

        console.log('LOGIN - REFRESH PAGE'); // eslint-disable-line no-console
        dispatch(refresh());
      })
      .catch(err => {
        console.error('CRASHED LOGIN - LOGIN ACTIONS'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}
