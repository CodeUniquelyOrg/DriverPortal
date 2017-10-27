//
// DashboardActions.js
//

import { OK, ACCEPTED } from 'constants/statusTypes';
import { HISTORY_SUCCESS, SHARE_SUCCESS, UNSHARE_SUCCESS } from 'constants/actionTypes';
// import { LATESTDRIVEOVER_SUCCESS, HISTORY_SUCCESS } from 'constants/actionTypes';
import { reset, errorOccurred, exceptionOccurred } from 'actions/ErrorActions';
import { spinnerOn, spinnerOff, registered, termsAccepted } from 'actions/AppActions';

import callApi from 'services/apiCaller';

// export const success = (data) => {
//   return {
//     type: LATESTDRIVEOVER_SUCCESS,
//     data,
//   };
// };

export const success = (data) => {
  return {
    type: HISTORY_SUCCESS,
    data,
  };
};

export const shareSuccess = (data) => {
  return {
    type: SHARE_SUCCESS,
    data,
  };
};

export const unshareSuccess = (data) => {
  return {
    type: UNSHARE_SUCCESS,
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
        console.error('CRASHED HISTORY - DASHBOARD ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}

// uses 'isomorphic-fetch' => callApi
export function generateShareCode(vehicleId) {
  return (dispatch) => {
    dispatch(spinnerOn());

    dispatch(reset()); // RESET ERRORS / EXCEPTIONS

    return callApi(`share/${vehicleId}`)
      .then(res => {
        dispatch(spinnerOff());

        if (res.status !== OK) {
          return dispatch(errorOccurred(res.status, res.json));
        }

        // pull the json payload from the data
        dispatch(shareSuccess(res.json));
      })
      .catch(err => {
        console.error('CRASHED SHARE - DASHBOARD ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}

export function unshare(vehicleId) {
  return (dispatch) => {
    dispatch(spinnerOn());

    dispatch(reset()); // RESET ERRORS / EXCEPTIONS

    return callApi(`share/${vehicleId}`, 'delete')
      .then(res => {
        dispatch(spinnerOff());

        if (res.status !== OK) {
          return dispatch(errorOccurred(res.status, res.json));
        }

        // pull the json payload from the data
        dispatch(unshareSuccess(res.json));
      })
      .catch(err => {
        console.error('CRASHED SHARE - DASHBOARD ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}

export function registerVehicle(vehicleId) {
  return (dispatch) => {
    dispatch(spinnerOn());

    dispatch(reset()); // RESET ERRORS / EXCEPTIONS

    console.warn(vehicleId); // eslint-disable-line no-console

    return callApi(`vehicle/${vehicleId}`, 'put')
      .then(res => {
        dispatch(spinnerOff());

        if (res.status !== ACCEPTED) {
          return dispatch(errorOccurred(res.status, res.json));
        }

        // pull the json payload from the data
        dispatch(unshareSuccess(res.json));
      })
      .catch(err => {
        console.error('CRASHED SHARE - DASHBOARD ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}

export function removeVehicle(vehicleId) {
  return (dispatch) => {
    dispatch(spinnerOn());

    dispatch(reset()); // RESET ERRORS / EXCEPTIONS

    return callApi(`vehicle/${vehicleId}`, 'delete')
      .then(res => {
        dispatch(spinnerOff());

        if (res.status !== OK) {
          return dispatch(errorOccurred(res.status, res.json));
        }

        // pull the json payload from the data
        dispatch(unshareSuccess(res.json));
      })
      .catch(err => {
        console.error('CRASHED SHARE - DASHBOARD ACTIONS'); // eslint-disable-line no-console
        dispatch(spinnerOff());
        dispatch(exceptionOccurred(err));
      });
  };
}

// uses 'isomorphic-fetch' => callApi
// export function getLatestDriveOver() {
//   return (dispatch) => {
//     dispatch(spinnerOn());
//
//     dispatch(reset()); // RESET ERRORS / EXCEPTIONS /
//
//     return callApi('driveover/latest')
//       .then(res => {
//         dispatch(spinnerOff());
//         if (res.status !== OK) {
//           return dispatch(errorOccurred(res.status, res.json));
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
