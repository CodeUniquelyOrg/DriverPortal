//
// RegisterActions.js
//

import { CREATED } from 'constants/statusTypes';
import { errorOccurred, exceptionOccurred } from 'actions/ErrorActions';
import { spinnerOn, spinnerOff, registered, loggedIn } from 'actions/AppActions';
import { logIn } from 'services/tokens';

import callApi from 'services/apiCaller';

// =======================================
// uses 'isomorphic-fetch' => callApi
// =======================================
export function register(forename, surname, email, password) {
  return (dispatch) => {
    dispatch(spinnerOn());
    return callApi('auth/register', 'post', { forename, surname, email, password })
      .then(res => {
        dispatch(spinnerOff());
        if (res.status !== CREATED) {
          return dispatch(errorOccurred(res.status, res.json));
        }
        logIn();
        dispatch(registered());
        dispatch(loggedIn());
      })
      .catch(err => {
        console.error('CRASHED - REGISTER ACTIONS'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err, 'CRASHED - REGISTER ACTIONS'));
      });
  };
}
