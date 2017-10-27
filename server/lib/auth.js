// ===============================================================
// Written by steve saxton <steves@codeuniquely.co.uk>
// various authentication middleware and supporting functions
// ===============================================================
import status from 'http-status';
import jwt from 'jwt-simple';

// pull in the standard format results handlers
import { sendUnauthorizedResponse, sendForbiddenResponse } from 'lib/utils';

// import { getAllRegistrations, getDbUserById } from 'lib/user';
import { getDbUserById } from 'lib/user';

// server configuation
import serverConfig from 'server/config';

// expires is defined in seconds (not milliseconds)
export function generateToken(user, exp = serverConfig.auth.expire) {
  if (!user) {
    return undefined;
  }
  const expTime = Math.round(Date.now() / 1000, 0) + exp;
  const obj = {
    userId: user._id, // .toString(),
    email: user.email, // .toLowerCase().trim(),
  };
  return jwt.encode({ iss: serverConfig.version, user: obj, exp: expTime }, serverConfig.auth.secret);
}

export function decodeToken(token) {
  if (!token) {
    return undefined;
  }
  return jwt.decode(token, serverConfig.auth.secret);
}

export function hasToken(headers) {
  let token;
  if (!headers) {
    return token;
  }

  const apiToken = headers['x-api-auth'] || null;
  if (apiToken) {
    token = apiToken;
  } else {
    // 'x-auth' - used by browser
    const appToken = headers['x-auth'] || null;
    if (appToken) {
      token = appToken;
    } else {
      // Other apps, may pass in an 'authorization' token
      const authToken = headers.authorization || null;
      if (authToken) {
        // Look for 'Bearer ', followed by the token
        if (authToken.indexOf('Bearer ') !== -1) {
          token = authToken.replace('Bearer ', '');
        } else {
          token = authToken;
        }
      }
    }
  }
  return token;
}

// =============================================
// Middleware(s)
// =============================================
export function decorate(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const token = hasToken(req.headers);

  // if there is no token just move to next middleware
  // deal with a cookie 'issue' ....
  if (!token || token === 'undefined') {
    return next();
  }

  try {
    // decode the token - with VERIFY wicthed on ....
    const auth = jwt.decode(token, serverConfig.auth.secret);

    if (!auth) {
      console.log('INVALID TOKEN'); // eslint-disable-line no-console
      // return res.sendStatus(status.UNAUTHORIZED);
      return sendUnauthorizedResponse(res, 'INVALID TOKEN');
    }

    // was the token encoded for this application
    if (auth.iss !== serverConfig.version) {
      console.log('WRONG TOKEN ISS'); // eslint-disable-line no-console
      // return res.sendStatus(status.UNAUTHORIZED);
      return sendUnauthorizedResponse(res, 'WRONG TOKEN ISS');
    }

    // did token expire before this 'now' time
    if (Date.now() > auth.exp * 1000) {
      console.log('EXPIRED TOKEN'); // eslint-disable-line no-console
      // return res.sendStatus(status.UNAUTHORIZED);
      return sendUnauthorizedResponse(res, 'EXPIRED TOKEN');
    }

    // inject the decoded TOKEN into the request ...
    req.jwt = auth;

    // if we have a TOKEN - then - We MUST have a userId ???
    const userId = auth.user.userId;

    // EXTRACT userId from token and find that user ONLY
    getDbUserById(userId, (err, user) => {

      if (err) {
        console.log('NOT FOUND THE USER'); // eslint-disable-line no-console
        // ---- REALLY ?????
        return next(err);
      }

      // deactivated
      if (!user) {
        console.log('USER DEACTIVATED === NULL'); // eslint-disable-line no-console
        // return res.sendStatus(status.FORBIDDEN);
        return sendForbiddenResponse(res, 'USER DEACTIVATED === NULL');
      }
      // Does userId (encoded) in token match the iternal _id;
      // no => then user is not who they are preteding to be
      if (auth.user.userId !== user._id.toString()) {
        console.log('USER NOT MATCHING CURRENT'); // eslint-disable-line no-console
        // return res.sendStatus(status.FORBIDDEN);
        return sendForbiddenResponse(res, 'USER NOT MATCHING CURRENT');
      }

      // Inject the user proprties into the request....
      console.log(`USER WAS IDENTIFIED BY JWT AS ${userId}`); // eslint-disable-line no-console
      req.user = user;

      return next();
    });
  } catch (err) {
    // veriify may throw an error if modified / meddled with
    console.log(`AUTH ERROR ${err}`); // eslint-disable-line
    // return res.sendStatus(status.UNAUTHORIZED);
    return sendUnauthorizedResponse(res, `AUTH ERROR ${err}`);
  }
}

//
// token = {
//   user: { email, _id },
//   iis: config.version,
//   exp: '... ticks ...',
// };
//
export function authorize(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!req.jwt) {
    console.log('NO TOKEN - UNAUTHORIZED'); // eslint-disable-line no-console
    // return res.sendStatus(status.UNAUTHORIZED);
    return sendUnauthorizedResponse(res, 'NO TOKEN - UNAUTHORIZED');
  }

  if (!req.user) {
    console.log('NO USER - FORBIDDEN'); // eslint-disable-line no-console
    // return res.sendStatus(status.FORBIDDEN);
    return sendForbiddenResponse(res, 'NO USER - FORBIDDEN');
  }

  // const auth = res.jwt;
  // const user = res.user;
  // check to see if they have user.email || user.password || user.other.registeredUser

  // if (auth.user.userId !== user._id.toString()) {
  //   return res.sendStatus(status.FORBIDDEN);
  // }
  next();
}

export function registeredOnly(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (req.user && req.user.other && req.user.other.registeredUser) {
    return next();
  }
  // return res.sendStatus(status.UNAUTHORIZED);
  return sendUnauthorizedResponse(res, 'REGISTERED ONLY');
}

export function termsAcceptedOnly(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (req.user && req.user.other && req.user.other.termsAccepted) {
    return next();
  }
  // return res.sendStatus(status.UNAUTHORIZED);
  return sendUnauthorizedResponse(res, 'TERMS ACCEPTED ONLY');
}
