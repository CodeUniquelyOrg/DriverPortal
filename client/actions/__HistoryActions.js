//
// HistoryActions.js
//

import { OK } from 'constants/statusTypes';
import { HISTORY_SUCCESS } from 'constants/actionTypes';
import { reset, errorOccurred, exceptionOccurred } from 'actions/ErrorActions';
import { spinnerOn, spinnerOff, registered, termsAccepted } from 'actions/AppActions';

import callApi from 'services/apiCaller';

export const success = (data) => {
  return {
    type: HISTORY_SUCCESS,
    data,
  };
};

// uses 'isomorphic-fetch' => callApi
export function getHistory() {
  return (dispatch) => {
    dispatch(spinnerOn());

    dispatch(reset()); // RESET ERRORS / EXCEPTIONS

    return callApi('history/me')
      .then(res => {
        dispatch(spinnerOff());

        if (res.status !== OK) {
          return dispatch(errorOccurred(res.status, res.json));
        }

        // pull the json payload from the data
        dispatch(success(res.json));
      })
      .catch(err => {
        console.error('CRASHED HISTORY - HISTORY ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}
