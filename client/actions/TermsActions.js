//
// TermsActions.js
//

import { ACCEPTED } from 'constants/statusTypes';
import { errorOccurred, exceptionOccurred } from 'actions/ErrorActions';
import { termsAccepted, spinnerOn, spinnerOff } from 'actions/AppActions';

import callApi from 'services/apiCaller';

// =======================================
// uses 'isomorphic-fetch' => callApi
// =======================================
export function accept() {
  const user = {
    other: {
      termsAccepted: true,
    }
  };
  return (dispatch) => {
    dispatch(spinnerOn());
    return callApi('user/me', 'put', user)
      .then(res => {
        dispatch(spinnerOff());
        if (res.status !== ACCEPTED) {
          return dispatch(errorOccurred(res.status, res.json));
        }
        dispatch(termsAccepted());
      })
      .catch(err => {
        console.error('CRASHED ACCEPT - TERMS ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}
