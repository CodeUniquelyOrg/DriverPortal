import httpMocks from 'node-mocks-http'; // defines mock request & response object

// =============================================================
// two imports used inside auth will be mocked / stubbed by JEST
// =============================================================
import jwt from 'jwt-simple';
import * as lib from 'lib/user';
import * as utils from 'lib/utils';

// =============================================================
// The functions in lib/auth that we wil be testing in this file
// =============================================================
import { hasToken, generateToken, decodeToken, decorate, authorize, registeredOnly, termsAcceptedOnly } from 'lib/auth';

// =============================================================
// mock serverConfig load in lib/auth and set these known values
// =============================================================
jest.mock('server/config', () => {
  return {
    version: '0.0.0',
    auth: {
      secret: 'test',
      expire: 60, // 60 second expiry time for tokens
    }
  };
});

// WILL NEED THIS FOR SOME 'REAL' ENCODE / DECODE TESTING ???
// const originalJWT = jwt;

// OK, so wrap JWT & lib/user in JEST mocks
jest.mock('jwt-simple');
jest.mock('lib/user');
jest.mock('lib/utils');

// fixed the user requst
// jwt.encode.mockReturnValue('thisisa.simplemocked.jwttoken');
// jwt.decode.mockReturnValue({ iss: '1.0.0', exp: validDate, user: { userId: 1, email: 'test@test.com' } });

// // this is the sequence that we will be using later
// lib.getDbUserById
//   .mockImplementationOnce((id, cb) => cb({ error: 'mogooose error' }))
//   .mockImplementationOnce((id, cb) => cb(null, null))
//   .mockImplementationOnce((id, cb) => cb(null, { _id: '1' }))
//   .mockImplementationOnce((id, cb) => cb(null, { _id: '1' }));

// define some useful values
const nowMin = Math.round(Date.now() / 1000, 0);
const validDate = nowMin + 60; // expires 60 minutes from now
const invalidDate = nowMin - 60; // take off 1 minute

// MOCK the status results that are expected
const mockStatus = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

/* eslint-disable no-console */
// const doesConsoleLogContain = (f, message) => {
//   let oldLog = console.log;
//   let result = false;
//   console.log = function(s) {
//     if (s.indexOf(message) !== -1) {
//       result = true;
//     }
//   };
//   f();
//   console.log = oldLog;
//   return result;
// };

// MOCK Calls into support lib
beforeAll(() => {
  utils.sendUnauthorizedResponse = jest.fn();
  utils.sendForbiddenResponse = jest.fn();
});

// ============================================
// lib/auth.hasToken()
// ============================================
describe('Auth hasToken', () => {
  //
  test('should return NULL if no headers exist', () => {
    expect(hasToken(undefined)).toBeUndefined();
  });

  test('should return NULL if null headers exist', () => {
    expect(hasToken(null)).toBeUndefined();
  });

  test('should return NULL if empty headers exist', () => {
    expect(hasToken({})).toBeUndefined();
  });

  test('should return value of x-api-auth', () => {
    const headers = {
      'x-api-auth': 'test',
    };
    expect(hasToken(headers)).toBe('test');
  });

  test('should return value of x-api-auth if two or more headers defined', () => {
    const headers = {
      'x-api-auth': 'test',
      'x-auth': 'test-other',
    };
    expect(hasToken(headers)).toBe('test');
  });

  test('should return value of x-auth if defined', () => {
    const headers = {
      'x-auth': 'test-other',
    };
    expect(hasToken(headers)).toBe('test-other');
  });

  test('should return value of x-auth even if authorization is defined', () => {
    const headers = {
      'x-auth': 'test-other',
      'authorization': 'Bearer testing',
    };
    expect(hasToken(headers)).toBe('test-other');
  });

  test('should bearer authorization token even if "Bearer " is not defined', () => {
    const headers = {
      authorization: 'testing',
    };
    expect(hasToken(headers)).toBe('testing');
  });

  test('should bearer authorization token with "Bearer " defined', () => {
    const headers = {
      authorization: 'Bearer testing',
    };
    expect(hasToken(headers)).toBe('testing');
  });
  //
});

// ============================================
// lib/auth.generateToken()
// ============================================
describe('Auth generateToken', () => {
  //
  beforeEach(() => {
    jwt.encode.mockClear();
    const token = jest.fn(() => 'a-jwt-token');
    jwt.encode.mockReturnValue(token());
    // const token = jest.fn(() => 'a-jwt-token');
    // jwt.encode.mockImplementation(() => token);
    // jwt.encode.mockImplementationOnce(() => 'a-jwt-token');
  });

  test('should not generate a token without a user', () => {
    expect(generateToken(undefined)).toBeUndefined();
  });

  test('should not generate a token with a NULL user', () => {
    expect(generateToken(null)).toBeUndefined();
  });

  test('should a token with a empty user', () => {
    const user = {};

    const token = generateToken(user);

    expect(token).toBeDefined();
    expect(token).toEqual('a-jwt-token');
    expect(jwt.encode).toHaveBeenCalledTimes(1);
  });
  test('should generate a token with just an id', () => {
    const user = {
      _id: '1',
    };

    const token = generateToken(user);

    expect(token).toBeDefined();
    expect(token).toEqual('a-jwt-token');
    expect(jwt.encode).toHaveBeenCalledTimes(1);
  });
  test('should generate a token with just an email', () => {
    const user = {
      email: 'test@test.com',
    };

    const token = generateToken(user);

    expect(token).toBeDefined();
    expect(token).toEqual('a-jwt-token');
    expect(jwt.encode).toHaveBeenCalledTimes(1);
  });
  test('should generate a token with an id and an email', () => {
    const user = {
      _id: '1',
      email: 'test@test.com',
    };

    const token = generateToken(user);

    expect(token).toBeDefined();
    expect(token).toEqual('a-jwt-token');
    expect(jwt.encode).toHaveBeenCalledTimes(1);
  });
  //
});

// ============================================
// lib/auth.decodeToken()
// ============================================
describe('Auth decodeToken', () => {
  //
  test('should not decode with a undefined token', () => {
    expect(decodeToken(undefined)).toBeUndefined();
  });

  test('should not decode with a NULL token', () => {
    expect(decodeToken(null)).toBeUndefined();
  });

  test('should not decode with a empty token', () => {
    expect(decodeToken('')).toBeUndefined();
  });
  test('should not decode with an invalid token', () => {
    expect(decodeToken('some.invalid.token')).toBeUndefined();
  });
  test('should decode with a valid token', () => {
    // jwt.decode.mockReturnValue({ iss: '0.0.0', exp: validDate, user: { userId: 'some-one-else', email: 'test@test.com' } });

    const token = decodeToken('valid-token');
    expect(token).toBeDefined();
    expect(token).toEqual('a-jwt-token');
    expect(jwt.decodeToken).toHaveBeenCalledTimes(1); // accumulates across all tests !!!
  });
  //
});

// ============================================
// lib/auth.decorate()
// ============================================
describe('Auth decorate (pre DB)', () => {
  //
  test('should skip OPTIONS requests', () => {
    const mockReq = httpMocks.createRequest({
      method: 'OPTIONS',
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should skip when no headers', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should reject when no token in x-api-auth', () => {
    const mockReq = httpMocks.createRequest({
      headers: { 'x-api-auth': undefined }
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should reject when no token in x-auth', () => {
    const mockReq = httpMocks.createRequest({
      headers: { 'x-auth': undefined }
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should reject when no token in authorization', () => {
    const mockReq = httpMocks.createRequest({
      // method: 'GET',
      headers: { authorization: undefined }
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    decorate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should be UNAUTHORIZED when there is an invalid token', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer invalid.token.string' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expecting a console message to be written
    console.log = jest.fn();

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.json()).toBe({ status: mockStatus.UNAUTHORIZED });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('INVALID TOKEN');
  });

  // how do we make it throw an exceprtion ???
  // jwt.decode(token, serverConfig.auth.secret);
  test('should handle execption in jwt.decode', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer testing' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expecting a console message to be written
    console.log = jest.fn();

    // jwt.decode.mockReturnValue({ iss: '9.9.9', exp: validDate, user: { userId: '1', email: 'test@test.com' } });
    jwt.decode.mockImplementationOnce(cb => { throw new Error('jwt exception'); });

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('AUTH ERROR Error: jwt exception');
  });

  test('should be UNAUTHORIZED when token issue property changes', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer testing' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    console.log = jest.fn();

    // define a mock value for jwt decode
    jwt.decode.mockReturnValue({ iss: '9.9.9', exp: validDate, user: { userId: '1', email: 'test@test.com' } });

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('WRONG TOKEN ISS');
  });

  test('should be UNAUTHORIZED if token has expired', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer testing' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to log 'EXPIRED TOKEN'
    console.log = jest.fn();

    // define a mock value for jwt
    jwt.decode.mockReturnValue({ iss: '0.0.0', exp: invalidDate, user: { userId: '1', email: 'test@test.com' } });

    decorate(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('EXPIRED TOKEN');
  });
  //
});

describe('Auth decorate DB potion', () => {
  //
  beforeEach(() => {
    lib.getDbUserById.mockClear();
  });

  test('should be NOT FOUND if DB Error', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer testing' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to log 'EXPIRED TOKEN'
    console.log = jest.fn();

    // define a mock value for jwt
    jwt.decode.mockReturnValue({ iss: '0.0.0', exp: validDate, user: { userId: '1', email: 'test@test.com' } });
    lib.getDbUserById.mockImplementationOnce((id, cb) => cb({ error: 'mogooose error' }));

    decorate(mockReq, mockRes, mockNext);
    expect(mockReq.jwt).toBeDefined();
    // expect(lib.getDbUserById).toHaveBeenCalledWith('1');
    expect(lib.getDbUserById.mock.calls[0][0]).toEqual('1');
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith({ error: 'mogooose error' });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NOT FOUND THE USER');
  });

  test('should be FORBIDDEN if user deactivated', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer testing' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to log 'EXPIRED TOKEN'
    console.log = jest.fn();

    // define a mock value for jwt
    jwt.decode.mockReturnValue({ iss: '0.0.0', exp: validDate, user: { userId: '1', email: 'test@test.com' } });
    lib.getDbUserById.mockImplementationOnce((id, cb) => cb(null, null));

    decorate(mockReq, mockRes, mockNext);

    // expect(mockRes.jwt).toBeDefined();
    // expect(lib.getDbUserById).toHaveBeenCalledWith('1');
    expect(lib.getDbUserById.mock.calls[0][0]).toEqual('1');
    expect(mockReq.jwt).toBeDefined();
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendForbiddenResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.FORBIDDEN);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('USER DEACTIVATED === NULL');
  });

  test('should be FORBIDDEN if DB user does not match id in token', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer testing' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to log 'EXPIRED TOKEN'
    console.log = jest.fn();

    // define a mock value for jwt
    jwt.decode.mockReturnValue({ iss: '0.0.0', exp: validDate, user: { userId: 'some-one-else', email: 'test@test.com' } });
    lib.getDbUserById.mockImplementationOnce((id, cb) => cb(null, { _id: '1' }));

    decorate(mockReq, mockRes, mockNext);

    // expect(mockRes.jwt).toBeDefined();
    // expect(lib.getDbUserById).toHaveBeenCalledWith('1');
    expect(lib.getDbUserById.mock.calls[0][0]).toEqual('some-one-else');
    expect(mockReq.jwt).toBeDefined();
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendForbiddenResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.FORBIDDEN);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('USER NOT MATCHING CURRENT');
  });

  test('should be OK if user matches token', () => {
    const mockReq = httpMocks.createRequest({
      headers: { authorization: 'Bearer testing' }
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to log 'EXPIRED TOKEN'
    console.log = jest.fn();

    // define a mock value for jwt
    jwt.decode.mockReturnValue({ iss: '0.0.0', exp: validDate, user: { userId: '1', email: 'test@test.com' } });
    lib.getDbUserById.mockImplementationOnce((id, cb) => cb(null, { _id: '1' }));

    decorate(mockReq, mockRes, mockNext);

    // expect(lib.getDbUserById).toHaveBeenCalledWith('1');
    expect(lib.getDbUserById.mock.calls[0][0]).toEqual('1');
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockReq.jwt).toBeDefined();
    expect(mockReq.user).toBeDefined();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('USER WAS IDENTIFIED BY JWT AS 1');
  });
  //
});

// ============================================
// lib/auth.authorize()
// ============================================
describe('Auth authorize', () => {
  //
  test('should skip OPTIONS requests', () => {
    const mockReq = httpMocks.createRequest({
      method: 'OPTIONS',
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    authorize(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should UNAUTHORIZED when no JWT property', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to log 'NO TOKEN - UNAUTHORIZED'
    console.log = jest.fn();

    authorize(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NO TOKEN - UNAUTHORIZED');
  });

  test('should FORBIDDEN when no "user" property', () => {
    const mockReq = httpMocks.createRequest({
      jwt: {}
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to log 'NO USER - FORBIDDEN'
    console.log = jest.fn();

    authorize(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendForbiddenResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.FORBIDDEN);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NO USER - FORBIDDEN');
  });

  test('should pass when both defined', () => {
    const mockReq = httpMocks.createRequest({
      jwt: {},
      user: {}
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    authorize(mockReq, mockRes, mockNext);

    // expect(lib.getDbUserById).toHaveBeenCalledWith('1');
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(mockNext).toHaveBeenCalledTimes(1);
    // expect(mockRes.jwt).toBeDefined();
    // expect(mockRes.user).toBeDefined();
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  // end
});

// ============================================
// lib/auth.registeredOnly()
// ============================================
describe('Auth registeredOnly', () => {
  test('should skip OPTIONS requests', () => {
    const mockReq = httpMocks.createRequest({
      method: 'OPTIONS',
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    registeredOnly(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should fail when user is not defined', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    registeredOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should fail when user.other is not defined', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
      user: {},
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    registeredOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should fail when user.other.registeredUser is not defined', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
      user: {
        other: {}
      },
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    registeredOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should fail when user.other.registeredUser is false', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
      user: {
        other: {
          registeredUser: false,
        }
      },
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    registeredOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should pass when registeredUser user is true', () => {
    const mockReq = httpMocks.createRequest({
      user: {
        other: {
          registeredUser: true,
        }
      },
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    registeredOnly(mockReq, mockRes, mockNext);

    // expect(lib.getDbUserById).toHaveBeenCalledWith('1');
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(mockNext).toHaveBeenCalledTimes(1);
    // expect(mockRes.jwt).toBeDefined();
    // expect(mockRes.user).toBeDefined();
    expect(console.log).toHaveBeenCalledTimes(0);
  });
  //
});

// ============================================
// lib/auth.termsAcceptedOnly()
// ============================================
describe('Auth termsAcceptedOnly', () => {
  //
  test('should skip OPTIONS requests', () => {
    const mockReq = httpMocks.createRequest({
      method: 'OPTIONS',
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    termsAcceptedOnly(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should fail when user is not defined', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    termsAcceptedOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should fail when user.other is not defined', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
      user: {},
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    termsAcceptedOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should fail when user.other.termsAccepted is not defined', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
      user: {
        other: {}
      },
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    termsAcceptedOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should fail when user.other.termsAccepted is false', () => {
    const mockReq = httpMocks.createRequest({
      method: 'GET',
      user: {
        other: {
          termsAccepted: false,
        }
      },
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    termsAcceptedOnly(mockReq, mockRes, mockNext);

    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(utils.sendUnauthorizedResponse).toHaveBeenCalled();
    // expect(mockRes.statusCode).toBe(mockStatus.UNAUTHORIZED);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('should pass when termsAccepted user is true', () => {
    const mockReq = httpMocks.createRequest({
      user: {
        other: {
          termsAccepted: true,
        }
      },
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // expect console to not be called
    console.log = jest.fn();

    termsAcceptedOnly(mockReq, mockRes, mockNext);

    // expect(lib.getDbUserById).toHaveBeenCalledWith('1');
    expect(mockRes.statusCode).toBe(mockStatus.OK);
    expect(mockNext).toHaveBeenCalledTimes(1);
    // expect(mockRes.jwt).toBeDefined();
    // expect(mockRes.user).toBeDefined();
    expect(console.log).toHaveBeenCalledTimes(0);
  });
  //
});
/* eslint-enable no-console */
