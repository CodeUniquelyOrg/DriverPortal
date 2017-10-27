//
// User Helper functions
//
import objectPath from 'object-path';
import User from 'models/user';

// =======================================================
// count the number of registrtions a user has
// =======================================================
export const countRegistrations = (user) => {
  const list = user.registrations.filter(obj => {
    return (obj.vehicleId === data.vehicleId);
  });
  return list.length;
};

// =======================================================
// Is a vehicle in the list of registrations for a user
// =======================================================
export const isVehicleInUsersList = (user, vehicleId) => {
  if (!user || !user.registrations) {
    return false;
  }
  const list = user.registrations.filter(reg => reg.vehicleId === vehicleId);
  return list.length > 0;
};

// =======================================================
// Get a specific vehicle from those in the users list
// =======================================================
export const findVehicleInUsersList = (user, vehicleId) => {
  if (!user || !user.registrations) {
    return false;
  }
  const list = user.registrations.filter(reg => reg.vehicleId === vehicleId);
  return (list.length > 0) ? list[0] : null;
};

// =======================================================
// get ALL of a users a users registrations
// =======================================================
export const getAllRegistrations = (user, quote = false) => {
  const now = new Date();
  if (!user || !user.registrations || user.registrations.length === 0) {
    return null;
  }
  return user.registrations.map(reg => {
    const vehicleId = reg.vehicleId;
    const fromDate = quote ? reg.fromDate : new Date(reg.fromDate);
    const toDate = quote ? reg.lastViewedDate : new Date(reg.lastViewedDate);
    const registered = reg.isRegistered;
    const newToUser = reg.isNewVehicleToUser;
    const isMovedOn = reg.isMovedOn;
    return {
      vehicleId, fromDate, toDate, registered, newToUser, isMovedOn,
    };
  });
};

// =======================================================
// LATEST vehcile cteated by access code ordered by date.
// =======================================================
export const getLatestRegistration = (user) => {
  if (!user || !user.registrations) {
    return null;
  }
  let date;
  let latest = null;
  user.registrations.forEach(reg => {
    const lastView = reg.lastViewedDate;
    if (!date || lastView > date) {
      date = lastView;
      latest = reg;
    }
  });
  return latest;
};

//
// Update the lastViewedDate, isNewVehicleToUser flags of a registration
//
export const vehicleHasBeenViewed = (user, vehicleId, date) => {
  if (!user || !vehicleId || !date) {
    return;
  }
  user.registrations.forEach(reg => {
    const viewedDate = new Date(date);
    if (reg.vehicleId === vehicleId) {
      // we are updating the lastViewedDte so this vehcile canot be new to user
      reg.isNewVehicleToUser = false;
      const lastViewedDate = reg.lastViewedDate;
      if (viewedDate > lastViewedDate) {
        reg.lastViewedDate = date;
      }
    }
  });
};

//
// Return a list of registrations - minus a given id
//
export const removeRegistrationRecord = (user, vehicleId) => {
  const list = [];
  user.registrations.forEach(reg => {
    if (reg.vehicleId !== vehicleId) {
      list.push(reg);
    }
  });
  user.registrations = list;
};

//
// Return a list of shared vehicleId - minus a given userId
//
export const removeSharedRegistrationRecord = (registration, userId) => {
  const list = [];
  registration.sharedWith.forEach(id => {
    if (id.toString() !== userId.toString()) {
      list.push(id);
    }
  });
  registration.sharedWith = list;
};

// ===================================
// {
//   vehicleId: ''
//   newVehicleId: ''
//   identifiedAs: ''
//   fromDate: ''
//   location: ''
//   isRegistered: ? optional ?
//   tyres: []
// }
// ===================================
export const updateRegistrationRecord = (user, reg, minTread) => {
  // find the old vehicleId in the copied record
  const record = findVehicleInUsersList(user, reg.vehicleId); // USING THE OLD VEHICLE ID
  if (!record) {
    console.log('NOT FOUND OLD RECORD IN USER RECORD'); // eslint-disable-line no-console
    const thisReg = {
      vehicleId: reg.vehicleId,
      plate: reg.identifiedAs || '',
      normalizedPlate: reg.identifiedAs || '',
      fromDate: reg.fromDate,
      lastViewedDate: reg.fromDate,
      isNewVehicleToUser: true, // this is obviously new to this user
      ideal: {
        depth: minTread,
        pressures: [],
      }
    };

    // Push this 'previously unknown' registration into the users list of vehicles
    // added the new record so this call is finished
    return user.registrations.push(thisReg);
  }

  console.log('UPDATING OLD RECORD'); // eslint-disable-line no-console
  console.log(record); // eslint-disable-line no-console

  // vehicle has been split so update the id on this record
  if (reg.newVehicleId !== null) {
    record.vehicleId = reg.newVehicleId;
  } else {
    record.isMovedOn = true;
  }

  // not new to the user - updating it
  record.isNewVehicleToUser = false;

  // Only update the last viewed if this driveove-r is later
  if (new Date(reg.fromDate) > new Date(record.lastViewedDate)) {
    record.lastViewedDate = reg.fromDate;
  }

  // set the registereed flag equal to what it its
  if (typeof reg.isRegistered !== 'undefined') {
    record.isRegistered = reg.isRegistered;
  }

  console.log('RECORD IS NOW'); // eslint-disable-line no-console
  console.log(record); // eslint-disable-line no-console
};

//
// Combine user reegistartion records into a single list
//
export const mergeRegistrations = (original, toBeMergeIn) => {
  toBeMergeIn.forEach(reg => {
    const vehicleId = reg.vehicleId;

    if (!reg.ideal) {
      reg.ideal = {};
    }
    if (!reg.ideal.pressures) {
      reg.ideal.pressures = [];
    }
    let found;
    original.forEach(comp => {
      if (vehicleId === comp.vehicleId) {
        found = comp;
      }
    });

    // if user reg dos not exist in found add it in
    if (!found) {
      original.push(reg);
    } else {
      if (found.lastViewedDate > reg.lastViewedDate) {
        reg.lastViewedDate = found.lastViewedDate;
        reg.isRegistered = found.isRegistered;
      }

      // if either record considers this an old record - make it an old record
      // if (comp.isNewVehicleToUser === false || reg.isNewVehicleToUser === false) {
      //  reg.isNewVehicleToUser = false;
      // }

      // merging two records, by definition the vehicle as been seen at least twice !!!!
      reg.isNewVehicleToUser = false;

      if (!found.ideal) {
        found.ideal = {};
      }
      if (!found.ideal.pressures) {
        found.ideal.pressures = [];
      }
      // if it does exists - look for ideals and copy those
      if (found.ideal.pressures.length > 0 && reg.ideal.pressures.length === 0) {
        reg.ideal.pressures = found.ideal.pressures;
      }
    }
  });
  // combined records original + toBeMergeIn
  return original;
};

//
// List of USER records that have the vehcileId in their registrations
//
export const whatUsersHaveThisVehicle = (vehicleId, callback) => {
  const query = { 'registrations.vehicleId': vehicleId };
  User.find(query, callback);
};

export const getOwnerByVehicleId = (vehicleId, callback) => {
  const query = { 'registrations.vehicleId': vehicleId };
  User.find(query, (err, users) => {
    if (err) {
      return callback(err);
    }
    let found;
    let vehicle;
    users.forEach(user => {
      if (found) {
        return;
      }
      user.registrations.forEach(reg => {
        if (reg.vehicleId !== vehicleId || typeof reg.ownedBy !== 'undefined') {
          return;
        }
        found = user;
        vehicle = reg;
      });
    });
    callback(null, found, vehicle);
  });
};

// yes you could use an inline arrowfunction
// const isUserRegistered = (user) => user && user.other && user.other.isregistered;
export const isUserRegistered = (user) => {
  if (!user || !user.other) {
    return false;
  }
  return user.other.registeredUser;
  // return objectPath.get(user, 'other.registeredUser', false);
};

// yes you could use an inline arrowfunction
// const hasUserAcceptedTerms = (user) => user && user.other && user.other.termsAccepted;
export const hasUserAcceptedTerms = (user) => {
  if (!user || !user.other) {
    return false;
  }
  return user.other.termsAccepted;
  // return objectPath.get(user, 'other.termsAccepted', false);
};

export const hasTermsChanged = (user, next) => {
  console.log('INSIDE TERMS CHECK'); // eslint-disable-line no-console
  console.log(next); // eslint-disable-line no-console

  if (!next || !next.other || !next.other.termsAccepted) {
    console.log('NO NEED TO CHECK - NOTHING PASSED'); // eslint-disable-line no-console
    return false; // false if there is no a user
  }
  if (!user) {
    console.log('NO USER IN TERMS'); // eslint-disable-line no-console
    return false; // false if there is no a user
  }

  const t1 = objectPath.get(user, 'other.termsAccepted');
  const t2 = objectPath.get(next, 'other.termsAccepted');
  return t1 !== t2;
};

export const hasPhoneChanged = (user, next) => {
  if (!user) {
    return false; // false if there is no a user
  }

  // if the user has updated the phone number at all ...
  const oldNumber = objectPath.get(user, 'personal.contactBy.mobile', '');
  const newNumber = objectPath.get(next, 'personal.contactBy.mobile', '');
  if (oldNumber !== newNumber) {
    return true;
  }

  // if the user has swapped the language at all ...
  const oldLocale = objectPath.get(user, 'options.language', '');
  const newLOcale = objectPath.get(next, 'options.language', '');
  if (oldLocale !== newLOcale) {
    return true;
  }

  return false;
};

// Get the user by their given email address
export function getDbUserByEmail(email, callback) {
  User.findOne({ email }, (err, user) => {
    if (err) {
      callback(err);
    } else if (!user || user.disabled) {
      callback();
    } else {
      if (user.toObject) {
        user = user.toObject();
      }
      callback(null, user);
    }
  });
}

export function getDbUserById(userId, callback) {
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      callback(err);
    } else if (!user || user.disabled) {
      callback();
    } else {
      if (user.toObject) {
        user = user.toObject();
      }
      callback(null, user);
    }
  });
}

export const updateOnly = (id, newProps, callback) => {
  if (!id || !newProps) {
    const err = new Error('No id and/or properties were detected');
    return callback(err);
  }

  // locate the record by internal id matching userId
  User.findById(id, (err, doc) => {
    if (!doc) {
      const err = new Error('No matching record found to update');
      return callback(err);
    }
    // merge the new properties into this structure
    const record = Object.assign(doc, newProps);
    console.log('UPDATING ONLY RECORD'); // eslint-disable-line no-console

    record.save((err, user) => {
      if (err) {
        return callback(err);
      }
      if (user.toObject) {
        user = user.toObject();
      }
      callback(null, user);
    });
  });
};

export const removeUser = (id, callback) => {
  if (!id) {
    const err = new Error('No id and/or properties were detected');
    return callback(err);
  }
  // just Nuke the record in the db
  User.findByIdAndRemove(id, callback);
};

export const insertOrUpdate = (userObj, callback) => {
  if (!userObj) {
    const err = new Error('No user data was detected');
    return callback(err);
  }

  // locate the record by internal id matching userId
  User.findById(userObj._id, (err, doc) => {
    const record = (doc) ? Object.assign(doc, userObj) : new User(userObj);
    record.save(callback);
  });
};
