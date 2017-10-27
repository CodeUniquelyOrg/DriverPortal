//
// Process Driveover Code - Controller
//
import status from 'http-status';
import { sendOKResponse, sendNoContentResponse, sendErrorResponse, sendResetContentResponse } from 'lib/utils';
import { getRequest } from 'lib/async';
import { generateToken } from 'lib/auth';

import {
  //
  insertOrUpdate,
  isVehicleInUsersList,
  vehicleHasBeenViewed,
  //
} from 'lib/user';

// use the alias path
import serverConfig from 'server/config';
const options = serverConfig.options || {};

// This function is called by the 'ValidatePage'
export function processCode(req, res, next) {
  const code = req.params.code;

  // decode the above to get the data you want
  // console.log('The User is ', req.user); // eslint-disable-line
  // console.log('JWT is ', req.jwt); // eslint-disable-line

  getRequest(`validate/${code}`, null, (err, resp) => {
    if (err) {
      return sendErrorResponse(res, 'WebAPI (processCode) reported an error', err);
    }

    if (resp.status === status.NO_CONTENT) {
      return sendNoContentResponse(res, 'WebApi - NOT AN ACCESS CODE');
    }

    if (resp.status === status.RESET_CONTENT) {
      return sendResetContentResponse(res, 'WebApi - DATA GONE');
    }

    if (resp.status !== status.OK) {
      return sendErrorResponse(res, 'WebAPI reported an error processoing access code', resp.error);
    }

    // const user = req.user;
    let user = req.user;

    if (!user) {
      const locale = req.locale.trim();

      user = {
        preferences: {
          pressureUnits: options.pressure || 'bar',
          depthUnits: options.depth || 'mm',
          language: locale || options.language || 'de',
        },
        roles: ['driver'],
        registrations: [],
        disabled: false,
        other: {
          registeredUser: false,
        },
      };
    }

    // 'SuperAgent' returned the response in the 'body' property
    const data = resp.body;

    if (!isVehicleInUsersList(user, data.vehicleId)) {
      const thisReg = {
        plate: data.identifiedAs,
        normalizedPlate: data.identifiedAs,
        vehicleId: data.vehicleId,
        fromDate: data.fromDate,
        lastViewedDate: data.fromDate,
        isNewVehicleToUser: true, // this is obvioulsy new to this user
        ideal: {
          depth: options.minTread || 4, // should read serverConfig setting for this ....
          pressures: [],
        }
      };
      user.registrations.push(thisReg);
    } else {
      vehicleHasBeenViewed(user, data.vehicleId, data.fromDate);
    }

    insertOrUpdate(user, (err, record) => {
      if (err) {
        return sendErrorResponse(res, 'Failed to update user record', err);
      }
      sendOKResponse(res, {}, generateToken(record));
    });
  });
}

