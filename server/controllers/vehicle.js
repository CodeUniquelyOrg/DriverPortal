//
// Historical Data Controller
//
import status from 'http-status';
import { cleanUpResponse, cleanUpUser, sendNoContentResponse, sendAcceptResponse, sendErrorResponse, sendResetContentResponse, sendOkResponse } from 'lib/utils';
import { postRequest } from 'lib/async';
import { generateToken } from 'lib/auth';

import {
  //
  findVehicleInUsersList,
  insertOrUpdate,
  removeRegistrationRecord,
  //
} from 'lib/user';

// use the alias path
import serverConfig from 'server/config';
const options = serverConfig.options || {};

// ====================================================
// update all records  lastViewedDate and isNewToUser &
// returns a single 'lastest' driveover response record
// ====================================================

// This function is called by the 'ValidatePage'
export function registerVehicle(req, res, next) { // <- changed this!!!!
  const vehicleId = parseInt(req.params.vehicleId, 10);
  const user = req.user;

  console.log('*** IN registerVehicle for vehicle *** ', vehicleId); // eslint-disable-line no-console
  // no user, so short-curcuit, there can be no driveovers
  if (!user) {
    console.log('\nNO USER - NO DRIVEOVERS\n'); // eslint-disable-line no-console
    return sendNoContentResponse(res, 'WebApi - NO USER');
  }

  const found = findVehicleInUsersList(user, vehicleId);
  if (!found) {
    console.log('vehicle not in users list'); // eslint-disable-line no-console
    return sendResetContentResponse(res, 'WebApi - VEHICLE not in users list');
  }

  const list = [found];

  // decode the above to get the data you want
  // console.log('The User is ', req.user); // eslint-disable-line
  // console.log('JWT is ', req.jwt); // eslint-disable-line

  postRequest('vehicles/register', list, (err, response) => {
    if (err) {
      return sendErrorResponse(res, 'registerVehicle failed to update WebApi', err);
    }

    if (response.status === status.NO_CONTENT) {
      return sendNoContentResponse(res, 'registerVehicle - nothing to update');
    }

    console.log('RESPONSE BACK'); // eslint-disable-line no-console
    const registrations = response.body;

    console.log('RECORDS ARE'); // eslint-disable-line no-console
    console.log(response.body); // eslint-disable-line no-console

    // otherwise a list of vehicles updates come back as array of:
    // [
    //   {
    //      date: '...ISO DT...'
    //      isRegistered: T/F
    //      newVehicleId: 9999,
    //      vehicleId: 1610,
    //   },
    // ]
    registrations.forEach(reg => {
      console.log('\nPROCESSING ', reg); // eslint-disable-line no-console

      // find the old vehicleId in the copied record
      const record = findVehicleInUsersList(user, reg.vehicleId);

      // the forEach equivalent of the 'continue' statement
      if (!record) {
        return;
      }

      // skip if the vehcile has not been 'cloned / split'
      if (reg.newVehicleId !== reg.vehicleId) {
        console.log('IDENTIFIERS DONT MATCH'); // eslint-disable-line no-console

        // cereate a date from the date-time given
        const now = new Date(reg.date);

        // clone the old record over an 'empty' Object
        const newRecord = Object.assign({}, record);

        // lock the old record at the date given,
        record.lastViewedDate = now;

        // if the new 'clone/split' is accepted as the registered
        // remove the registered flag from the previous verion...
        if (reg.isRegistered) {
          record.isRegistered = false;
        }

        // replace the fromDate on the new record and update
        // the new record, with the 'clone/split' details...
        newRecord.fromDate = now;
        newRecord.lastViewedDate = now;
        newRecord.vehicleId = reg.newVehicleId;
        newRecord.isRegistered = reg.isRegistered;

        console.log('PUSH NEW RECORD'); // eslint-disable-line no-console
        // push the new 'clone/split' into user record
        user.registrations.push(newRecord);
        // record = newRecord;
      } else {
        console.log('IDENTIFIERS MATCH'); // eslint-disable-line no-console
        record.isRegistered = reg.isRegistered;
      }
    });

    insertOrUpdate(user, (err, doc) => {
      if (err) {
        return sendErrorResponse(res, 'Failed to update user record', err);
      }
      sendAcceptResponse(res, cleanUpUser(doc));
    });
  });
}

export function removeVehicle(req, res, next) {
  const vehicleId = parseInt(req.params.vehicleId, 10);
  const user = req.user;

  // no user, so short-curcuit, there can be no driveovers
  if (!user) {
    console.log('\nNO USER - NO DRIVEOVERS\n'); // eslint-disable-line no-console
    return sendNoContentResponse(res, 'WebApi - NO USER');
  }

  console.log('ABOUT TO REMOVE REG '); // eslint-disable-line no-console
  removeRegistrationRecord(user, vehicleId);
  insertOrUpdate(user, (err, doc) => {
    if (err) {
      return sendErrorResponse(res, 'Failed to update user record', err);
    }
    sendOkResponse(res, cleanUpUser(doc));
  });
}
