// ===============================================================
// Written by steve saxton <steves@codeuniquely.co.uk>
// Middleware functions that do helpful things
// ===============================================================
import objectPath from 'object-path';
import { sendBadRequestResponse, sendUnauthorizedResponse } from 'lib/utils';
// import { getAllRegistrations } from 'lib/user';

export function limitToDriver(req, res, next) {
  const user = req.user;
  if (!user) {
    return sendUnauthorizedResponse(res);
  }
  const roles = objectPath.get(user, 'roles', []);
  if (roles.indexOf('driver') !== -1) {
    return next();
  }
  return sendUnauthorizedResponse(res);
}

// return objectPath.get(user, 'other.registeredUser', false);
export function limitToManager(req, res, next) {
  const user = req.user;
  if (!user) {
    return sendUnauthorizedResponse(res);
  }
  const roles = objectPath.get(user, 'roles', []);
  if (roles.indexOf('manager') !== -1) {
    return next();
  }
  return sendUnauthorizedResponse(res);
}

export function limitToAdmin(req, res, next) {
  const user = req.user;
  if (!user) {
    return sendUnauthorizedResponse(res);
  }
  const roles = objectPath.get(user, 'roles', []);
  if (roles.indexOf('admin') !== -1) {
    return next();
  }
  return sendUnauthorizedResponse(res);
}

export function limitToAuthenticated(req, res, next) {
  const user = req.user;
  if (user) {
    return next();
  }
  return sendUnauthorizedResponse(res);
}

// =======================================================
// Check the UPDATE is acting on the same record, it read
// =======================================================
export function rejectIfRecordIdHasAlteredId(prop) {
  return function(req, res, next) {
    // id to compare from value of param[prop] indicated
    const param = req.params[prop];
    const id = parseInt(param, 10);
    const user = req.user;

    if (!user || user._id !== id) {
      return sendBadRequestResponse(res, 'Entry does not match id provided');
      // res.status(status.BAD_REQUEST).json({ error: 'entry does not match id provided' });
    }
    next();
  };
}

// Only allowed to get history of your own vehcileIdentifier matched data
export function limitToOwnRegistrations(req, res, next, vid) {
  const user = req.user;
  if (!user) {
    return sendUnauthorizedResponse(res);
  }
  const found = findVehicleInUsersList(user, vid);
  if (found) {
    return next();
  }
  return sendUnauthorizedResponse(res);
}
