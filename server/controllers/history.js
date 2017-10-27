//
// Historical Data Controller
//
import status from 'http-status';
import objectPath from 'object-path';
import async from 'async';

// support functions
import { postRequest } from 'lib/async';
import { combineResults } from 'lib/history';
import { getAllRegistrations, /* findVehicleInUsersList, */ insertOrUpdate, updateRegistrationRecord } from 'lib/user';

import { sendBadRequestResponse, sendOKResponse, sendNoContentResponse, sendErrorResponse, cleanUpResponse } from 'lib/utils';

// Configuration
import serverConfig from 'server/config';
const options = serverConfig.options || {};

// ======================================================
// get the history for the user
// actually making a mixed number of requests here...
// Lookup ALL vehicle registrations for user and get
// the start and end dates of those various periods
// of ownership and then in Async => request all the
// various results and when eveythig is complete
// aggregate results into a single return array in the
// desired format....
//
// n.b
// If users is NOT termsAccepted then JUST get the LAST
// data of the latest record that they can see ...
// ======================================================
export function getMyHistory(req, res, next) {
  const user = req.user;
  const minTread = options.minTread || 4;

  // get all possible user registrations
  const registrations = getAllRegistrations(user);

  // what happens when there are no registartions ???
  if (!registrations || registrations.length === 0) {
    return sendNoContentResponse(res, 'History - NO CONTENTS');
  }

  const tasks = registrations.map(reg => {
    console.log('REG'); // eslint-disable-line no-console
    console.log(reg); // eslint-disable-line no-console

    if (!reg.isMovedOn) {
      return function(done) {
        postRequest('driveover/history', reg, (err, result) => {
          if (err) {
            console.log('ERROR IS\n', err); // eslint-disable-line no-console
            done(err);
          }
          done(null, result);
        });
      };
    } else {
      console.log('RETURN UNDEFINED'); // eslint-disable-line no-console
      return undefined;
    }
  }).filter(x => x);

  console.log('TASKS TO REQUEST ARE'); // eslint-disable-line no-console
  console.log(tasks); // eslint-disable-line no-console

  // ============================================================
  // Process all the separate history request tasks in parallel
  // ============================================================
  async.parallel(tasks, (err, results) => {
    if (err) {
      console.log('ERROR IS\n', err); // eslint-disable-line no-console
      return sendErrorResponse(res, 'WebApi (getMyHistory) reported an error', err);
    }

    // What will the data be an array of ?
    // ===================================
    // {
    //    vehicleId: ''
    //    newVehicleId: ''
    //    identifiedAs: ''
    //    fromDate: ''
    //    location: ''
    //    isRegistered:
    //    tyres: []
    // }
    // ===================================

    // build a reduced set of history records
    const data = combineResults(results);

    console.log('HISTORY RESULTS ARE'); // eslint-disable-line no-console
    console.log(data); // eslint-disable-line no-console

    // get a reference to the results - if none, quit early
    if (!data || data.length === 0) {
      return sendNoContentResponse(res, 'history records for user, from WebAPI, is NULL');
      // return sendOKResponse(res, []);
    }

    // update each of the users' registration records from the return data
    data.forEach(vehicle => {
      if (vehicle) {
        updateRegistrationRecord(user, vehicle, minTread);
      } else {
        console.log('!!! NULL REG IS IN AN ARRAY'); // eslint-disable-line no-console
      }
    });

    console.log('Update User records with new info'); // eslint-disable-line no-console

    // update the user with all the ammended registration records
    insertOrUpdate(user, (err, record) => {
      if (err) {
        return sendErrorResponse(res, 'Failed to update user record', err);
      }

      const history = [];

      console.log('UPDATED REGs ', record.registrations); // eslint-disable-line no-console

      // =======================================================================
      // process each reg in the user, make a result with all the added FLAGS
      // =======================================================================
      record.registrations.forEach(reg => {
        // make a new history rec

        const vehicle = {
          vehicleId: reg.vehicleId,
          ideal: reg.ideal || {},
          plate: reg.plate || '',
          owned: reg.ownedBy || false,
          shared: reg.sharedWith && reg.sharedWith.length > 0,
          isMovedOn: reg.isMovedOn || false,
          isRegistered: reg.isRegistered || false,
          history: [],
        };

        // find the reduced history record
        data.forEach(d => {
          if (d.newVehicleId === reg.vehicleId) {
            if (!reg.isMovedOn) {
              vehicle.history = d.history;
            }
            return;
          }
        });

        // push vehicle record into the history response
        history.push(vehicle);
      });

      console.log('HISTORY RESPONSE IS '); // eslint-disable-line no-console
      console.log(history); // eslint-disable-line no-console
      sendOKResponse(res, history);
    });

    //
    // if (data.length > 0) {
    //
    //   // now populate these records with user defaults / preferences
    //   data.forEach(reg => {
    //
    //     //
    //     updateRegistrationRecord(user, reg, minTread);
    //
    //     const found = findVehicleInUsersList(user, reg.vehicleId);
    //     if (found) {
    //       reg.ideal = objectPath.get(found, 'ideal', {});
    //       reg.plate = objectPath.get(found, 'plate', '');
    //       reg.shared = objectPath.get(found, 'sharedWith', []).length > 0;
    //       reg.isRegistered = objectPath.get(found, 'isRegistered', false);
    //       const owner = objectPath.get(found, 'ownedBy', '').toString();
    //       reg.owned = owner !== '';
    //     }
    //   });
    //
    // }
    //
    // console.log('RESPONSE IS '); // eslint-disable-line
    // console.log(data); // eslint-disable-line
    //
    // // send the response back
    // sendOKResponse(res, data);
  });
}
