//
// Share Driveover Controller
//
import status from 'http-status';
import async from 'async';
import { cleanUpResponse, cleanUpUser, sendOKResponse, sendNoContentResponse, sendErrorResponse } from 'lib/utils';

import {
  //
  findVehicleInUsersList,
  insertOrUpdate,
  removeRegistrationRecord,
  removeSharedRegistrationRecord,
  whatUsersHaveThisVehicle,
  getOwnerByVehicleId,
  //
} from 'lib/user';

import { generateSharingCode, convertToHexString, reverseSharingCode } from 'lib/utils';

// use the alias path
import serverConfig from 'server/config';
const options = serverConfig.options || {};

// share/:vehicleId
export const generateCode = (req, res, next) => {
  const vid = parseInt(req.params.vehicleId % 1048576, 10); // 20 bits of vid
  const user = req.user;
  // const user = { _id: '59db4b2519c54391148689d2' };

  // 59d4fc3589b32e50adf0b971 => b971 => last 4 hex digits
  const uuid = user._id.toString().toUpperCase();
  const id = uuid.substr(uuid.length - 4);

  // wrap the vehicle id in the split uuid
  const code = generateSharingCode(vid, 5) + id;

  // return the code
  sendOKResponse(res, { share: code });
};

export const stopSharing = (req, res, next) => {

  console.log('STOP **** '); // eslint-disable-line no-console

  const vehicleId = parseInt(req.params.vehicleId, 10);
  const user = req.user;

  console.log('STOP vehicleId **** ', vehicleId); // eslint-disable-line no-console

  // does he user have this vehicle in their records ....
  const found = findVehicleInUsersList(user, vehicleId);
  if (!found) {
    console.log('NOT FOUND VEHICLE **** '); // eslint-disable-line no-console
    return sendOKResponse(res, cleanUpUser(user));
  }

  // NOT A SHAREEE RECORD (OWNER) - BUT NO SHAREDWITH DATA
  if (typeof found.ownedBy === 'undefined' && found.sharedWith.length === 0) {
    return sendOKResponse(res, cleanUpUser(user));
  }

  console.log('FOUND VEHICLE **** '); // eslint-disable-line no-console

  // user is sharing a vehicle owned by someone else
  if (typeof found.ownedBy !== 'undefined') {
    console.log('SHAREE - owned by **** '); // eslint-disable-line no-console
    const ownerId = found.ownedBy;

    // remove this vehcile from the users list
    console.log('ABOUT TO REMOVE REG '); // eslint-disable-line no-console
    removeRegistrationRecord(user, vehicleId);
    console.log('ABOUT TO UPDATE USER '); // eslint-disable-line no-console

    // update the user record
    insertOrUpdate(user, (err, record) => {
      if (err) {
        return sendErrorResponse(res, 'UNSHARE Failed to update user record', err);
      }

      // LOTS OF ERROR CHECKING WLL STILL BE NEEDED IN HERE ...

      getOwnerByVehicleId(vehicleId, (err, owner, vehicle) => {
        if (err) {
          return sendErrorResponse(res, 'UNSHARE Failed get the owner of the vehicle', err);
        }
        // remove this user from the owners sharedWith array of values
        removeSharedRegistrationRecord(vehicle, user._id);

        insertOrUpdate(owner, (err, record) => {
          if (err) {
            return sendErrorResponse(res, 'UNSHARE Failed to update owner record', err);
          }
          return sendOKResponse(res, record);
        });
      });
    });
  } else {
    // RIGHT NOW - Just unshare the vehicle - FROM EVERYONE
    console.log('OWNER - shared with **** '); // eslint-disable-line no-console
    // ???
    whatUsersHaveThisVehicle(vehicleId, (err, users) => {
      if (err) {
        return sendErrorResponse(res, 'SHARE Failed to find owner', err);
      }
      if (!users || users.lengh === 0) {
        return sendNoContentResponse(res, 'Error finding vehicle');
      }

      const tasks = users.map(sharee => {
        return function(done) {
          console.log('sharee **** ', sharee); // eslint-disable-line no-console
          if (sharee._id.toString() !== user._id.toString()) {
            // remove this vehcile from the users list
            removeRegistrationRecord(sharee, vehicleId);

            // update the user record
            return insertOrUpdate(sharee, done);
          }
          done();
        };
      });

      async.parallel(tasks, (err, results) => {
        if (err) {
          return sendErrorResponse(res, 'UNSHARE Failed to update sharee record', err);
        }

        // results is an array of task results
        // remove this user from the owners sharedWith array of values
        // removeSharedRegistrationRecord(found, user._id);
        found.sharedWith = [];

        insertOrUpdate(user, (err, record) => {
          if (err) {
            return sendErrorResponse(res, 'UNSHARE Failed to update user record', err);
          }
          return sendOKResponse(res, record);
        });
      });
    });
  }
};

// This function is called by the 'ValidatePage'
export function processShareCode(req, res, next) {
  const code = req.params.code;
  const user = req.user;

  // split the code into its constituant parts
  const info = reverseSharingCode(code);

  console.log('INFO **** ', info); // eslint-disable-line no-console

  const ihaveThis = findVehicleInUsersList(user, info.vid);
  if (ihaveThis) {
    console.log('Already HAVE VEHICLE'); // eslint-disable-line no-console
    return sendOKResponse(res, cleanUpUser(user));
  }

  // decode the back to a number
  // make the last 4 digits of the userID => 'b971'
  // rest is the  vehicId,
  whatUsersHaveThisVehicle(info.vid, (err, users) => {
    if (err) {
      return sendErrorResponse(res, 'SHARE Failed to find owner', err);
    }
    if (!users || users.lengh === 0) {
      return sendNoContentResponse(res, 'Error finding vehicle');
    }

    let vehicleOwner;
    users.forEach(owner => {
      console.log('OWNER **** ', owner); // eslint-disable-line no-console
      if (!owner._id.toString().endsWith(info.uuid)) {
        return;
      }
      vehicleOwner = owner;
    });
    if (!vehicleOwner) {
      console.log('NOT FOUND VEHICLE OWNER'); // eslint-disable-line
      return sendNoContentResponse(res, 'Error finding vehicle');
    }

    // find the exact vehcile
    const found = findVehicleInUsersList(vehicleOwner, info.vid);
    if (!found) {
      console.log('VEHICLE NOT IN OWNER LIST'); // eslint-disable-line
      return sendNoContentResponse(res, 'Vehicle no longer being shared by user');
    }

    // copy the registration information to a new objects, and set the 'ownedBy' flag
    let copied;
    if (found.toObject) {
      copied = Object.assign({}, found.toObject(), { ownedBy: vehicleOwner._id });
    } else {
      copied = Object.assign({}, found, { ownedBy: vehicleOwner._id });
    }

    // clean up copied
    delete copied._id; // eslint-disable-line
    delete copied.sharedWith; // eslint-disable-line
    delete copied.ideal._id; // eslint-disable-line

    // insert tag for shared - in the OWNER's record
    found.sharedWith.push(user._id); // *** !!!  *** need to check for duplicates

    // Save Both Records - don't care about seeing the returned owner version
    insertOrUpdate(vehicleOwner, err => {
      if (err) {
        console.log('STUFED UP WRITING OWNER UPDATE'); // eslint-disable-line
        return sendErrorResponse(res, 'SHARE - Failed to update owner record', err);
      }

      // update the user registrations, second - *** !!! *** need to check for duplicates
      user.registrations.push(copied);

      insertOrUpdate(user, (err, record) => {
        if (err) {
          console.log('STUFED UP WRITING USER UPDATE ', err); // eslint-disable-line
          return sendErrorResponse(res, 'SHARE Failed to update user record', err);
        }

        console.log(' *** OK *** '); // eslint-disable-line
        return sendOKResponse(res, cleanUpUser(record));
      });
    });
  });
}
