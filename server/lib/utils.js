import status from 'http-status';

const possible = 'ABCDEFGHJKLMNPQRSTVWXY1234567890';
const possibleLength = possible.length;

const padStart = (text, targetLength, padString) => {
  targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
  padString = padString || ' ';
  if (text.length > targetLength) {
    return text;
  } else {
    targetLength = targetLength - text.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
    }
    return padString.slice(0,targetLength) + text;
  }
};

// Clean up a response object to limit the amount of 'structure' present.
export const cleanUpResponse = (response) => {
  const copied = Object.assign({}, response);

  delete copied.res; // eslint-disable-line prefer-reflect
  delete copied.request; // eslint-disable-line prefer-reflect
  delete copied.req; // eslint-disable-line prefer-reflect
  delete copied.header; // eslint-disable-line prefer-reflect
  delete copied._events; // eslint-disable-line prefer-reflect
  delete copied._eventsCount; // eslint-disable-line prefer-reflect
  delete copied._maxListeners; // eslint-disable-line prefer-reflect
  delete copied.files; // eslint-disable-line prefer-reflect
  delete copied.buffered; // eslint-disable-line prefer-reflect
  delete copied.setEncoding; // eslint-disable-line prefer-reflect
  delete copied.redirect; // eslint-disable-line prefer-reflect
  delete copied.redirects; // eslint-disable-line prefer-reflect
  delete copied.links; // eslint-disable-line prefer-reflect

  // return the clipped object
  return copied;
};

export const cleanUpUser = (user) => {
  const copied = Object.assign({}, user);

  delete copied._id; // eslint-disable-line
  delete copied.__v; // eslint-disable-line
  delete copied.password; // eslint-disable-line
  delete copied.disabled; // eslint-disable-line

  if (copied.preferences) {
    delete copied.preferences._id; // eslint-disable-line
  }

  if (copied.other) {
    delete copied.other._id; // eslint-disable-line
  }

  if (copied.personal) {
    delete copied.personal._id; // eslint-disable-line
    if (copied.personal.name) {
      delete copied.personal.name._id; // eslint-disable-line
    }
  }

  // there are other properties that need to be cleaned ...
  // delete copied.preferences._id; // eslint-disable-line
  // delete copied.others._id; // eslint-disable-line
  // delete copied.registrations._id; // eslint-disable-line
  console.warn('CLEANED UP USER'); // eslint-disable-line no-console

  // return the clipped object
  return copied;
};

// Shared standard response format for PROMISE REQUESTS
const sendResponseWithStatus = (status, res, json, token) => {
  const response = {
    status,
    token,
    json,
  };
  res.json(response);
};

export const sendOKResponse = (res, json, token) => {
  sendResponseWithStatus(status.OK, res, json, token);
};

export const sendCreatedResponse = (res, json, token) => {
  sendResponseWithStatus(status.CREATED, res, json, token);
};

export const sendAcceptResponse = (res, json, token) => {
  sendResponseWithStatus(status.ACCEPTED, res, json, token);
};

export const sendNoContentResponse = (res, message = 'No Contents') => {
  const json = {
    message,
  };
  sendResponseWithStatus(status.NO_CONTENT, res, json);
};

export const sendConflictResponse = (res, message = 'conflict') => {
  const json = {
    message,
  };
  sendResponseWithStatus(status.CONFLICT, res, json);
};

export const sendResetContentResponse = (res, message = 'drive over taken') => {
  const json = {
    message,
  };
  sendResponseWithStatus(status.RESET_CONTENT, res, json);
};

export const sendBadRequestResponse = (res, message = 'Bad Request', err = {}) => {
  const json = {
    error: 'badrequest',
    message,
    err,
  };
  sendResponseWithStatus(status.BAD_REQUEST, res, json);
};

export const sendUnauthorizedResponse = (res, message = 'You are unauthorized for this request', err = {}) => {
  const json = {
    error: 'unauthorized',
    message,
    err,
  };
  sendResponseWithStatus(status.UNAUTHORIZED, res, json);
};

export const sendForbiddenResponse = (res, message = 'You are forbidden to make this request', err = {}) => {
  const json = {
    error: 'forbidden',
    message,
    err,
  };
  sendResponseWithStatus(status.FORBIDDEN, res, json);
};

export const sendErrorResponse = (res, message = 'internal server error', err = {}) => {
  const json = {
    error: 'internalservererror',
    message,
    err,
  };
  sendResponseWithStatus(status.INTERNAL_SERVER_ERROR, res, json);
};

//
// Convert a number into a 'padded' hex string
//
export const convertToHexString = (number, length) => {
  // return number.toString(16).padStart(length, '0');
  return padStart(number, length, '0');
};

//
// Reverse a 'sharing code' into its constituant parts
//
export const reverseSharingCode = (code) => {
  const uuid = code.substr(code.length - 4).toLowerCase();
  const vidStr = code.substr(0, 5);

  let vid = 0;
  let value;
  for (let i = 0; i < vidStr.length; i++) {
    value = possible.indexOf(vidStr[i]);
    if (value === -1) {
      throw new Error('Invalid Sharing Code');
    }
    vid = vid * possibleLength + value;
  }

  return {
    uuid,
    vid,
  };
};

//
// Reverse a Sharing code
//
export const generateSharingCode = (salt, pad) => {
  let response = '';
  while (salt > 0) {
    response = possible.charAt(salt % possibleLength) + response;
    salt = Math.floor(salt / possibleLength);
  }
  // return response.padStart(pad, possible[0]);
  return padStart(response, pad, possible[0]);
};
