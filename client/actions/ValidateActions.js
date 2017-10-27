//
// ValidateActions.js
//

import { OK, NO_CONTENT } from 'constants/statusTypes';
import { VALIDATE_SUCCESS } from 'constants/actionTypes';

// import { reset } from 'actions/DashboardActions';
import { reset, errorOccurred, exceptionOccurred } from 'actions/ErrorActions';
import { spinnerOn, spinnerOff } from 'actions/AppActions';
import { getUser } from 'actions/UserActions';

import callApi from 'services/apiCaller';

export function success() {
  return {
    type: VALIDATE_SUCCESS,
  };
}

// uses 'isomorphic-fetch' => callApi
export function validateCode(code) {
  console.log('GET DRIVEROVER HAS BEEN CALLED'); // eslint-disable-line no-console
  return (dispatch) => {
    dispatch(spinnerOn());

    console.log('VALIDATE - RESET API'); // eslint-disable-line no-console
    dispatch(reset());

    console.log('VALIDATE - CALLING API - NOW '); // eslint-disable-line no-console
    return callApi(`code/${code}`)
      .then(res => {
        dispatch(spinnerOff());
        if (res.status === OK) {
          console.warn('ABOUT TO SET TO SUCCESS!!!'); // eslint-disable-line no-console
          dispatch(getUser());
          return dispatch(success());
        }
        dispatch(errorOccurred(res.status, res.json));
      })
      .catch(err => {
        console.error('CRASHED VALIDATE - GETDRIVEOVER'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}

// uses 'isomorphic-fetch' => callApi
export function useShareCode(code) {
  console.log('USE SHARE CODE HAS BEEN CALLED'); // eslint-disable-line no-console
  return (dispatch) => {
    dispatch(spinnerOn());

    console.log('USE SHARE CODE - RESET API'); // eslint-disable-line no-console
    dispatch(reset());

    console.log('USE SHARE CODE - CALLING API - NOW '); // eslint-disable-line no-console
    return callApi(`share/${code}`, 'put')
      .then(res => {
        dispatch(spinnerOff());
        console.warn('HAVE STATUS', res.status); // eslint-disable-line no-console
        if (res.status === OK) {
          console.warn('ABOUT TO SET TO SHARE SUCCESS!!!'); // eslint-disable-line no-console
          dispatch(getUser());
          return dispatch(success());
        }
        console.warn('MUST BE AN ERORR'); // eslint-disable-line no-console
        dispatch(errorOccurred(res.status, res.json));
      })
      .catch(err => {
        console.error('CRASHED VALIDATE - USE SHARE CODE'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}
