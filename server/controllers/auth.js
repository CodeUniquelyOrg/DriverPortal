//
// Handle 'Auth' Requests
//
import objectPath from 'object-path';
import status from 'http-status';
import bcrypt from 'bcrypt-nodejs';

// get references to the libs we will use
import { sendOKResponse, sendCreatedResponse, sendConflictResponse, sendUnauthorizedResponse, sendForbiddenResponse, sendErrorResponse } from 'lib/utils';
import { isUserRegistered, getDbUserByEmail, getDbUserById, insertOrUpdate, mergeRegistrations, removeUser } from 'lib/user';
import { generateToken } from 'lib/auth';

// use the alias path
import serverConfig from 'server/config';
const options = serverConfig.options || {};

// POST .../auth/login/ [formdata]
export function login(req, res, next) {
  // func to be had here  ....
  const data = req.body;
  const user = req.user;

  console.log('\nLOGIN DATA is \n', data ); // eslint-disable-line

  // if there is no data or some of it is missing - UNAUTHORIZED
  if (!data || !data.email || !data.password) {
    console.log('MISSING USERNAME OR PASSWORD'); // eslint-disable-line no-console
    return sendUnauthorizedResponse(res); // status.UNAUTHORIZED);
  }

  // must find the user by email / password
  getDbUserByEmail(data.email, (err, foundUser) => {
    if (err) {
      console.log('LOGIN - DB ERROR - ACCESS'); // eslint-disable-line no-console
      return sendErrorResponse(res, 'ERROR ACESS DB', err);
    }

    if (!foundUser) {
      console.log('LOGIN - DID NOT MATCH THE USER'); // eslint-disable-line no-console
      return sendForbiddenResponse(res); // status.UNAUTHORIZED);
    }

    console.log('FOUND A USER WITH THE EMAIL [ID] IN THE DB'); // eslint-disable-line no-console

    // let the bcrypt library do password compare
    bcrypt.compare(data.password, foundUser.password, (err, match) => {
      if (err) {
        return sendErrorResponse(res, 'ERROR DECRYPTING USER', err);
      }
      if (!match) {
        console.log('ERROR MATCHING USER DETAILS'); // eslint-disable-line no-console
        return sendUnauthorizedResponse(res); // status.UNAUTHORIZED);
      }

      console.log('PASSWORD MATCHED DB ENTRY'); // eslint-disable-line no-console

      // if there is not a JWT
      if (!user) {
        console.log('GENERATE A JWT AND RETURN IT TO USER'); // eslint-disable-line no-console
        return sendOKResponse(res, {}, generateToken(foundUser));
      }

      // the logged in DB user's version of the user's data
      const comparisons = foundUser.registrations || [];

      // There is a JWT token version of the user too,
      // do the two ID's match - token is current
      if (user._id.toString() === foundUser._id.toString()) {
        console.log('JWT USER ID ALREADY MATCHES LOGIN ID'); // eslint-disable-line no-console
        return sendOKResponse(res, user);
      }

      // check if JWT user is considered 'regsitered' in the system
      console.log('JWT USER ID does NOT match the LOGIN ID - Check if old is registerd...'); // eslint-disable-line no-console

      // find out if the user is 'regisitered'
      const isJwtRegistered = objectPath.get(user, 'other.registeredUser', false);

      if (isJwtRegistered) {
        console.log('JWT USER IS REGISTERED, SO MAKE A NEW JWT AND RETURN IT TO THIS USER'); // eslint-disable-line no-console
        return sendOKResponse(res, {}, generateToken(foundUser));
      }

      // else
      console.log('OLD JWT USER IS NOT REGISTERED - Merge their record !!!'); // eslint-disable-line no-console

      // ELSE, its a different id between JWT and logged in user
      const registrations = user.registrations || [];

      // processs the registrations of the logged in user
      // by adding the data obtained from the JWT user...
      foundUser.registrations = mergeRegistrations(comparisons, registrations);

      // update the user
      insertOrUpdate(foundUser, (err, doc) => {
        if (err) {
          return sendErrorResponse(res, 'ERROR UPDATING USER DETAILS', err);
        }

        // SHOULD COMPLETELY kill the user identified by JWT token
        // removeUser(user._id);
        removeUser(user._id, err => { // eslint-disable-line
          if (err) {
            return sendErrorResponse(res, 'ERROR REMOVING USER', err);
          }

          // renew the JWT token based on combined user Id
          // const token = generateToken(doc);

          // Return the new token
          // res.json({ token }); // -- Status.OK is fine for LOGiN
          sendOKResponse(res, doc, generateToken(doc));
        });
      });
    });
  });
}

// POST .../auth/register/ [formdata]
export function register(req, res, next) {
  const user = req.user;

  console.warn('\nREGISTER DATA is\n', req.body ); // eslint-disable-line

  // take out the properties from FROMDATA  ....
  const {
    forename,
    surname,
    email,
    password,
  } = req.body;

  // if there is no data or some of it is missing - UNAUTHORIZED
  // there are other fields but I don't care about them right now ...
  if (!forename || !surname || !email || !password) {
    return sendForbiddenResponse(res); // status.UNAUTHORIZED);
  }

  // JWT exists - check if user is already registered
  if (user) {
    // USER cannot register twice
    if (isUserRegistered(user)) {
      console.warn('\nALREADY REGISTERED\n', req.body ); // eslint-disable-line
      return sendCreatedResponse(res, user); // send back the same data -
    }

    // not regsitered so, update the details to those passed in
    objectPath.set(user, 'email', email);
    objectPath.set(user, 'password', password);
    objectPath.set(user, 'personal.name.foreName', forename);
    objectPath.set(user, 'personal.name.lastName', surname);
    objectPath.set(user, 'other.registeredUser', true);

    // update user record with the new details
    insertOrUpdate(user, (err, doc) => {
      if (err) {
        return sendErrorResponse(res, 'REGISTER - UPDATING USER', err);
      }
      console.warn('\nSEND CERATED 1\n', user ); // eslint-disable-line
      sendCreatedResponse(res, doc, generateToken(doc)); // refresh the TOKEN
    });
  } else {
    // NEED A USER TO GENERATE A JWT => as it uses _ID or _ID & EMAIL
    // --- JWT AND USER DOES NOT EXIST
    getDbUserByEmail(email, (err, foundUser) => {
      if (err) {
        return sendErrorResponse(res, 'REGISTER - FINDING IDENTITY FROM EMAIL', err);
      }

      // does idenity already exist in DB
      if (foundUser) {
        return sendConflictResponse(res, 'IDENTITY CONFLICT'); // send back the same data -
      }

      // Set all viabel 'properties' of the user
      foundUser = {
        email,
        password,
        disabled: false,
        preferences: {
          pressureUnits: options.pressure || 'bar',
          depthUnits: options.depth || 'mm',
          language: options.language || 'de',
        },
        other: {
          registeredUser: true,
        },
        personal: {
          name: {
            foreName: forename,
            lastName: surname,
          }
        },
        roles: ['driver'],
        registrations: [], // user did not exist so it will have NO registrations
      };

      console.warn('\nABOUT TO INSERT\n', foundUser ); // eslint-disable-line

      // insert the record into the DB
      insertOrUpdate(foundUser, (err, doc) => {
        if (err) {
          return sendErrorResponse(res, 'REGISTER - INSERTING NEW USER', err);
        }
        console.warn('\nSEND CERATED 2\n', user ); // eslint-disable-line
        sendCreatedResponse(res, doc, generateToken(doc));
      });
    });
  }
}

// POST .../auth/forgot/ [formdata]
export function forgot(req, res) {
  return sendOKResponse(res);
}
