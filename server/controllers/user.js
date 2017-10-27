import objectPath from 'object-path';

import { cleanUpUser, sendOKResponse, sendNoContentResponse, sendAcceptResponse, sendErrorResponse } from 'lib/utils';
import { postRequest, getRequest } from 'lib/async';
import { generateToken } from 'lib/auth';

import {
  insertOrUpdate,
  updateOnly,
  getAllRegistrations,
  findVehicleInUsersList,
  isVehicleInUsersList,
  isUserRegistered,
  hasUserAcceptedTerms,
  hasTermsChanged,
  hasPhoneChanged,
} from 'lib/user';

// ==================================================================
// Handle requests for tPhone Number update (and include the locale)
// ==================================================================
const handleUpdateVehiclesWithPhoneNumber = (user, body, callback) => {
  console.log('HANDLE MOBILE'); // eslint-disable-line no-console

  if (!hasPhoneChanged(user, body)) {
    console.warn('NO UPDATE TO PHONE NUMBER'); // eslint-disable-line no-console
    return callback();
  }

  console.log('UPDATE NUMBER FOR LIST'); // eslint-disable-line no-console

  const oldNumber = objectPath.get(user, 'personal.contactBy.mobile', '');
  const newNumber = objectPath.get(body, 'personal.contactBy.mobile', '');
  const list = user.registrations.map(reg => reg.vehicleId).join(',');

  const locale = objectPath.get(body, 'preferences.language') || objectPath.get(user, 'preferences.language', 'en');
  const data = {
    oldNumber,
    newNumber,
    locale,
    vehicles: list,
  };

  console.log('OBJECT IS'); // eslint-disable-line no-console
  console.log(data); // eslint-disable-line no-console

  // Just expecting an 'OK' to come back and there is no user record update
  postRequest('vehicles/mobile', data, callback);
};

// ==================================================================
// handle the notification that user has registered (with vehicles)
// ==================================================================
const handleNotifyVehiclesAsRegistered = (user, body, callback) => {
  console.log('HANDLE REGISTERED'); // eslint-disable-line no-console

  const copied = Object.assign({}, user);
  if (!hasTermsChanged(copied, body)) {
    console.warn('NO UPDATE TO TERMS => NEXT, PASS USER RECORD'); // eslint-disable-line no-console
    return callback(null, copied);
  }

  // since the termsAccepted and / or registeredUser flag differs, we need to
  // make sure that we copy the flags from the body over to the copied object
  // objectPath.set(copied, 'other.registeredUser', objectPath.get(body, 'other.registeredUser'));
  objectPath.set(copied, 'other.termsAccepted', objectPath.get(body, 'other.termsAccepted'));

  const list = getAllRegistrations(user, true);
  // copied.registrations.map(reg => {
  //   return {
  //     vehicleId: reg.vehicleId,
  //     date: reg.fromDate, // lastViewedDate
  //     // toDate: reg.lastViewedDate,
  //     // newToUser: reg.isNewVehicleToUser,
  //     // registered: reg.isRegistered,
  //   };
  // });

  console.log('\n\nSTATE OF THE NATION IS'); // eslint-disable-line no-console
  console.log(copied); // eslint-disable-line no-console
  console.log('\n\n'); // eslint-disable-line no-console

  // const list = copied.registrations.map(reg => reg.vehicleId).join(',');
  console.log('POST TO VEHICLES/REGISTER'); // eslint-disable-line no-console

  postRequest('vehicles/register', list, (err, response) => {
    if (err) {
      return callback(err);
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
      const record = findVehicleInUsersList(copied, reg.vehicleId);

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
        copied.registrations.push(newRecord);
      } else {
        console.log('IDENTIFIERS MATCH'); // eslint-disable-line no-console
        record.isRegistered = reg.isRegistered;
      }
    });

    console.log('PASS BACK NEW USER'); // eslint-disable-line no-console
    const cleaner = cleanUpUser(copied);
    console.log('CLEANER ', cleaner); // eslint-disable-line no-console

    callback(null, cleaner);
  });
};

// const handleOtherPropertyUpdates = (user, body, callback) => {
//   return Object.assign({}, user, copied);
// };

export const get = (req, res, next) => {
  const user = req.user;

  // clean up some of stuff in returned object
  const copied = cleanUpUser(user);

  sendOKResponse(res, copied);
};

//
// Needs to be way better than just this.....
//
export const update = (req, res, next) => {
  const user = req.user;
  if (!user) {
    console.warn('NO USER CONTENTS'); // eslint-disable-line no-console
    return sendNoContentResponse(res, 'NO USER CONTENTS');
  }

  const body = req.body;
  if (!body) {
    console.warn('NO BODY CONTENTS'); // eslint-disable-line no-console
    return sendNoContentResponse(res, 'NO BODY CONTENTS');
  }

  // *** SHOULD ALWAYS update mobile phones if LOCALE has changed  ***

  // // IF THE USER HAS NO REGISTRATIONS - JUST POST THE TERMS ACCEPTED
  // if(user.registrations.length === 0) {
  // }

  // fire and forget !!!
  handleUpdateVehiclesWithPhoneNumber(user, body, err => {
    if (err) {
      return sendErrorResponse(res, 'FAILED PHONE NUMBER UPDATE', err);
    }

    // fire and forget !!!
    handleNotifyVehiclesAsRegistered(user, body, (err, copied) => {
      console.warn('HAS JUST handleNotifyVehiclesAsRegistered'); // eslint-disable-line no-console
      if (err) {
        return sendErrorResponse(res, 'FAILED NOTIFY VEHICLES REGISTERED', err);
      }

      console.log('UPDATE PROPERTIES LOOK LIKE THIS'); // eslint-disable-line no-console
      console.log(cleanUpUser(body)); // eslint-disable-line no-console

      // need tp process other BODY properties
      // handleOtherPropertyUpdates(copied, body);
      const merged = Object.assign({}, copied, body);

      console.log('UPDATED USER IS NOW'); // eslint-disable-line no-console
      console.log(cleanUpUser(merged)); // eslint-disable-line no-console

      // do the user record update - one timeonly
      updateOnly(user._id, merged, (err, doc) => {
        if (err) {
          console.warn('updateOnly FAILED ', err); // eslint-disable-line no-console
          return sendErrorResponse(res, 'FAILED UPDATE ONLY ERROR', err);
        }

        // const oldEmail = objectPath.get(user, 'personal.contactBy.email', '');
        // const newEmail = objectPath.get(doc, 'personal.contactBy.email', '');

        // SHOULD ONLY generate a token if (email address has changed)
        if (doc.email !== user.email) {
          console.log('ACCEPTED, NEW TOKEN...'); // eslint-disable-line no-console
          return sendAcceptResponse(res, cleanUpUser(doc), generateToken(doc));
        }

        console.log('ACCEPTED...'); // eslint-disable-line no-console
        sendAcceptResponse(res, cleanUpUser(doc));
      });
    });
  });
};
