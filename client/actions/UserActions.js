//
// UserActions.js
//

import { OK, ACCEPTED } from 'constants/statusTypes';
import { USER_GET_SUCCESS, USER_SET_SUCCESS } from 'constants/actionTypes';
import { errorOccurred, exceptionOccurred } from 'actions/ErrorActions';
import { spinnerOn, spinnerOff, registered, termsAccepted } from 'actions/AppActions';

import { switchLanguage } from 'actions/IntlActions';

import callApi from 'services/apiCaller';

export function getSuccess(json) {
  return {
    type: USER_GET_SUCCESS,
    json,
  };
}

export function setSuccess(json) {
  return {
    type: USER_SET_SUCCESS,
    json,
  };
}

// =======================================
// uses 'isomorphic-fetch' => callApi
// =======================================
export function getUser() {
  return (dispatch) => {
    dispatch(spinnerOn());
    return callApi('user/me')
      .then(res => {
        dispatch(spinnerOff());
        if (res.status !== OK) {
          return dispatch(errorOccurred(res.status, res.json));
        }
        if (res.json) {
          console.log('USER - RES'); // eslint-disable-line no-console
          console.log(res); // eslint-disable-line no-console

          console.log('USER - RES.JSON'); // eslint-disable-line no-console
          console.log(res.json); // eslint-disable-line no-console

          if (res.json.other) {
            console.log('USER - RES.JSON.OTHER'); // eslint-disable-line no-console
            console.log(res.json.other); // eslint-disable-line no-console

            const other = res.json.other;
            if (other.registeredUser) {
              console.log('USER - FIRING REGISTERED'); // eslint-disable-line no-console
              dispatch(registered());
            }
            if (other.termsAccepted) {
              console.log('USER - FIRING TERMS_ACCEPTED'); // eslint-disable-line no-console
              dispatch(termsAccepted());
            }
          }
          if (res.json.preferences) {
            const lang = res.json.preferences.language;
            if (lang) {
              dispatch(switchLanguage(lang));
            }
          }

          dispatch(getSuccess(res.json));
        }
        // ================================
        // NO JSON - NOTHING TO UPDATE ....
        // ================================
      })
      .catch(err => {
        console.error('CRASHED GET - USER ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}

// =======================================
// uses 'isomorphic-fetch' => callApi
// =======================================
export function setUser(data) {
  return (dispatch) => {
    dispatch(spinnerOn());
    return callApi('user/me', 'put', data)
      .then(res => {
        dispatch(spinnerOff());
        if (res.status !== ACCEPTED) {
          return dispatch(errorOccurred(res.status, res.json));
        }
        if (res.json) {
          if (res.json.preferences) {
            const lang = res.json.preferences.language;
            if (lang) {
              dispatch(switchLanguage(lang));
            }
          }
        }
        dispatch(setSuccess(res.json));
      })
      .catch(err => {
        console.error('CRASHED SET - USER ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}
