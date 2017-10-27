import httpMocks from 'node-mocks-http'; // defines mock request & response object
import status from 'http-status';

import * as asyncLib from 'lib/async';
import * as authLib from 'lib/auth';
import * as utilLib from 'lib/utils';
import * as userLib from 'lib/user';

import { processCode, getLatest } from 'controllers/driveover';

// ***************************
// Mock Wrap various libraries
// ***************************
jest.mock('lib/async');
jest.mock('lib/auth');
jest.mock('lib/utils');
jest.mock('lib/user');

// =============================================================
// mock serverConfig load in lib/auth and set these known values
// =============================================================
jest.mock('server/config', () => {
  return {
    options: {
      depth: 'mm',
      pressure: 'psi',
      language: 'en',
      minTread: 6,
    }
  };
});

//
// mock vehicle data
//
const mockVehicle = {
  vehicleId: 90,
  identifiedAs: 'XX00 TST',
  fromDate: '2017-08-02T12:00:00.000',
  location: 'Test',
  tyres: [
    {
      id: '11',
      pressure: 234.567,
      depth: 5,
    },
    {
      id: '12',
      pressure: 234.567,
      depth: 5,
    },
    {
      id: '21',
      pressure: 234.567,
      depth: 5,
    },
    {
      id: '22',
      pressure: 234.567,
      depth: 5,
    }
  ]
};

const mockEmptyUser = {
  roles: ['driver'],
  disabled: false,
  preferences: {
    pressureUnits: 'psi',
    depthUnits: 'mm',
    language: 'en',
  },
  other: {
    registeredUser: false,
  },
  registrations: [],
};

//
// mock a user record
//
const mockUser = {
  email: 'test@test.com',
  password: 'test',
  roles: ['driver'],
  disabled: false,
  preferences: {
    language: 'en',
    pressureUnits: 'psi',
    depthUnits: 'mm',
  },
  other: {
    registeredUser: false,
  },
  registrations: [
    {
      vehicleId: 90,
      plate: 'XX00 TST',
      normalizedPlate: 'XX00TST',
      fromDate: '2017-08-01T08:00:00.000',
      lastViewedDate: '2017-08-01T08:00:00.000',
      isNewVehicleToUser: false,
      isRegistered: false,
      ideal: {
        depth: 6,
        pressures: [
          {
            id: '11',
            pressure: 234.000
          },
          {
            id: '12',
            pressure: 234.000
          },
          {
            id: '21',
            pressure: 234.000
          },
          {
            id: '22',
            pressure: 234.000
          }
        ]
      }
    },
  ],
  personal: {
    name: {
      foreName: 'Test',
      lastName: 'User'
    }
  },
};

describe('Driveover processCode', () => {
  //

  // (err) => message
  test('Should return "Error Response" when an error occurs', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // Make it throw an exception
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb({ text: 'ERROR MESSAGE' }));

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // check request
    // expect(userLib.getRequest).toHaveBeenCalledWith('validate/TEST1NGME', null);

    // 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'Error Response'
    expect(utilLib.sendErrorResponse).toHaveBeenCalledWith(mockRes, 'WebAPI (processCode) reported an error', { text: 'ERROR MESSAGE' });

    //
  });

  // message = 'No Contents'
  test('Should return "No Contents" after a NO_CONTENT is returned', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.NO_CONTENT }));

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'No Content'
    expect(utilLib.sendNoContentResponse).toHaveBeenCalledWith(mockRes, 'WebApi - NO ACCESS CODE');

    //
  });

  test('Should return "Error Response" after not getting an OK', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.BAD_REQUEST, error: 'ERROR' }));

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'Error Response'
    expect(utilLib.sendErrorResponse).toHaveBeenCalledWith(mockRes, 'WebAPI reported an error', 'ERROR');
    //
  });

  //
});

describe('Driveover processCode, when there is not a JWT', () => {
  //
  test('Should create a user after getting an OK, but respond with error if DB errors', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.OK, body: mockVehicle }));

    // inserting a record in the user DB is GOING TO fail
    userLib.insertOrUpdate.mockImplementationOnce((user, cb) => cb('Mongo Error'));

    // mock the check - return false
    userLib.isVehicleInUsersList.mockImplementationOnce((user, id) => false);

    // vehicle that should be created
    const reg = {
      plate: mockVehicle.identifiedAs,
      normalizedPlate: mockVehicle.identifiedAs,
      vehicleId: mockVehicle.vehicleId,
      fromDate: mockVehicle.fromDate,
      lastViewedDate: mockVehicle.fromDate,
      isNewVehicleToUser: true,
      ideal: {
        depth: 6,
        pressures: [],
      }
    };

    // combine it all together to get the expected user
    const expectedUser = Object.assign({}, mockEmptyUser, { registrations: [reg] });

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // check for vehicle should have been made
    expect(userLib.isVehicleInUsersList).toHaveBeenCalledWith(expectedUser, mockVehicle.vehicleId);

    // insertOrUpdate should been called => but will fail
    expect(userLib.insertOrUpdate).toHaveBeenCalledTimes(1);
    expect(userLib.insertOrUpdate.mock.calls[0][0]).toEqual(expectedUser);

    // 'Error Response'
    expect(utilLib.sendErrorResponse).toHaveBeenCalledWith(mockRes, 'Failed to update user record', 'Mongo Error');

    //
  });

  test('Should create a user and generate a token after getting an OK', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.OK, body: mockVehicle }));

    // reset the counter before this call
    userLib.insertOrUpdate.mockClear();
    userLib.insertOrUpdate.mockImplementationOnce((user, cb) => cb(null, {}));
    authLib.generateToken.mockReturnValue('TOKEN');

    // mock the check - return false
    userLib.isVehicleInUsersList.mockImplementationOnce((user, id) => false);

    // vehicle that should be created
    const reg = {
      plate: mockVehicle.identifiedAs,
      normalizedPlate: mockVehicle.identifiedAs,
      vehicleId: mockVehicle.vehicleId,
      fromDate: mockVehicle.fromDate,
      lastViewedDate: mockVehicle.fromDate,
      isNewVehicleToUser: true,
      ideal: {
        depth: 6,
        pressures: [],
      }
    };

    // combine it all together to get the expected user
    const expectedUser = Object.assign({}, mockEmptyUser, { registrations: [reg] });

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // check for vehicle should have been made
    expect(userLib.isVehicleInUsersList).toHaveBeenCalledWith(expectedUser, mockVehicle.vehicleId);

    // insertOrUpdate should been called => but will fail
    expect(userLib.insertOrUpdate).toHaveBeenCalledTimes(1);
    expect(userLib.insertOrUpdate.mock.calls[0][0]).toEqual(expectedUser);

    // expect an OK resposne
    expect(utilLib.sendOKResponse).toHaveBeenCalledWith(mockRes, {}, 'TOKEN');
  });

  //
});

describe('Driveover processCode, when a JWT exists', () => {

  test('Should update the registration if matched but respond with error if DB errors', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
      user: Object.assign({}, mockUser),
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.OK, body: mockVehicle }));

    // mock the check - return false
    userLib.isVehicleInUsersList.mockImplementationOnce((user, id) => false);

    // reset the counter before this call
    userLib.insertOrUpdate.mockClear();
    // inserting a record in the user DB is GOING TO fail
    userLib.insertOrUpdate.mockImplementationOnce((user, cb) => cb('Mongo Error'));

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // check for vehicle should have been made
    expect(userLib.isVehicleInUsersList).toHaveBeenCalledWith(mockUser, mockVehicle.vehicleId);

    // insertOrUpdate should been called => but will fail
    expect(userLib.insertOrUpdate).toHaveBeenCalledTimes(1);
    expect(userLib.insertOrUpdate.mock.calls[0][0]).toEqual(mockUser);

    // 'Error Response'
    expect(utilLib.sendErrorResponse).toHaveBeenCalledWith(mockRes, 'Failed to update user record', 'Mongo Error');

    //
  });

  /* !!! *** !!!! */
  test('Should update registration if matched but respond with error if DB errors', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
      user: Object.assign({}, mockUser),
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.OK, body: mockVehicle }));

    // mock the check - return true
    userLib.isVehicleInUsersList.mockImplementationOnce((user, id) => true);

    // Just moke the 'vehicleHasBeenViewed' function
    userLib.vehicleHasBeenViewed = jest.fn();

    // reset the counter before this call
    userLib.insertOrUpdate.mockClear();
    // inserting a record in the user DB is GOING TO fail
    userLib.insertOrUpdate.mockImplementationOnce((user, cb) => cb('Mongo Error'));

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // check for vehicle should have been made
    expect(userLib.isVehicleInUsersList).toHaveBeenCalledWith(mockUser, mockVehicle.vehicleId);

    // update should happen
    expect(userLib.vehicleHasBeenViewed).toHaveBeenCalledWith(mockUser, mockVehicle.vehicleId, mockVehicle.fromDate);

    // insertOrUpdate should been called => but will fail *** !!! ***
    expect(userLib.insertOrUpdate).toHaveBeenCalledTimes(1);
    expect(userLib.insertOrUpdate.mock.calls[0][0]).toEqual(mockUser);

    // 'Error Response'
    expect(utilLib.sendErrorResponse).toHaveBeenCalledWith(mockRes, 'Failed to update user record', 'Mongo Error');

    //
  });

  /* !!! *** !!!! */
  test('Should create a user and generate a token after getting an OK', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com?code=TEST1NGME',
      user: Object.assign({}, mockUser),
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.getRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.OK, body: mockVehicle }));

    // mock the check - return true
    userLib.isVehicleInUsersList.mockImplementationOnce((user, id) => true);

    // Just moke the 'vehicleHasBeenViewed' function
    userLib.vehicleHasBeenViewed = jest.fn();

    // reset the counter before this call
    userLib.insertOrUpdate.mockClear();
    // inserting a record in the user DB is GOING TO fail
    userLib.insertOrUpdate.mockImplementationOnce((user, cb) => cb(null, {}));

    // Token method will be called
    authLib.generateToken.mockReturnValue('TOKEN');

    // run the test
    processCode(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // check for vehicle should have been made
    expect(userLib.isVehicleInUsersList).toHaveBeenCalledWith(mockUser, mockVehicle.vehicleId);

    // update should happen
    expect(userLib.vehicleHasBeenViewed).toHaveBeenCalledWith(mockUser, mockVehicle.vehicleId, mockVehicle.fromDate);

    // insertOrUpdate should been called => but will fail
    expect(userLib.insertOrUpdate).toHaveBeenCalledTimes(1);
    expect(userLib.insertOrUpdate.mock.calls[0][0]).toEqual(mockUser);

    // expect an OK resposne
    expect(utilLib.sendOKResponse).toHaveBeenCalledWith(mockRes, {}, 'TOKEN');
  });

  //
});

describe('Driveover getLatest', () => {
  //

  test('Should return "NO CONTENT" response when there is NO user', () => {
    //

    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com/driveover/latest',
      // user: undefined,
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // clear the previous call counter
    // userLib.sendNoContentResponse.mockClear();

    // run the test
    getLatest(mockReq, mockRes, mockNext);

    // 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'Error Response'
    // expect(utilLib.sendNoContentResponse).toHaveBeenCalledTimes(1);
    expect(utilLib.sendNoContentResponse).toHaveBeenCalledWith(mockRes, 'WebApi - NO USER');

    //
  });

  // check request
  // expect(userLib.getRequest).toHaveBeenCalledWith('validate/TEST1NGME', null);

  test('Should return "Error Response" when there are no registartions found', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com/driveover/latest',
      user: Object.assign({}, mockUser),
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // no registrations will be returned
    userLib.getAllRegistrations.mockReturnValue(null);
    // userLib.getAllRegistrations.mockImplementationOnce((user, quote) => cb(null, {}));

    // run the test
    getLatest(mockReq, mockRes, mockNext);

    // 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'Error Response'
    expect(utilLib.sendNoContentResponse).toHaveBeenCalledWith(mockRes, 'WebApi (getLatest) - NO DRIVEOVERS FOUND');

    //
  });

  test('Should return "Error Response" when an error occurs', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com/driveover/latest',
      user: Object.assign({}, mockUser),
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // no registrations will be returned
    // userLib.getAllRegistrations.mockImplementationOnce((user, quote) => cb(null, {}));
    userLib.getAllRegistrations.mockReturnValue(mockUser.registrations);

    // Make request throw an exception
    // postRequest('driveover/latest', registrations, (err, response) => {
    asyncLib.postRequest.mockImplementationOnce((url, data, cb) => cb({ text: 'ERROR MESSAGE' }));

    // run the test
    getLatest(mockReq, mockRes, mockNext);

    // 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'Error Response'
    // expect(utilLib.sendNoContentResponse).toHaveBeenCalledWith(mockRes, 'WebApi (getLatest) - NO DRIVEOVERS FOUND');
    // const registrations = [];

    // 'Error Response'
    expect(utilLib.sendErrorResponse).toHaveBeenCalledWith(mockRes, 'WebApi (getLatest) reported an error', { text: 'ERROR MESSAGE' });

    //
  });

  test('Should return "NO CONTENT" when there is no content error occurs', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com/driveover/latest',
      user: Object.assign({}, mockUser),
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // no registrations will be returned
    // userLib.getAllRegistrations.mockImplementationOnce((user, quote) => cb(null, {}));
    userLib.getAllRegistrations.mockReturnValue(mockUser.registrations);

    // Make request throw an exception
    // postRequest('driveover/latest', registrations, (err, response) => {
    // asyncLib.postRequest.mockImplementationOnce((url, data, cb) => cb({ text: 'ERROR MESSAGE' }));
    asyncLib.postRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.NO_CONTENT }));

    // run the test
    getLatest(mockReq, mockRes, mockNext);

    // 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'Error Response'
    expect(utilLib.sendNoContentResponse).toHaveBeenCalledWith(mockRes, 'WebApi - NO MATCHING DRIVEOVERS FOUND');

    //
  });

  test('Should return "Error Response" after not getting an OK', () => {
    //
    const mockReq = httpMocks.createRequest({
      url: 'http://www.test.com/driveover/latest',
      user: Object.assign({}, mockUser),
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    // WebAPI returns a NO-CONTENT STATUS
    asyncLib.postRequest.mockImplementationOnce((url, data, cb) => cb(null, { status: status.BAD_REQUEST, error: 'ERROR' }));

    // run the test
    getLatest(mockReq, mockRes, mockNext);

    // expect 'next' NOT TO HAVE BEEEN called
    expect(mockNext).toHaveBeenCalledTimes(0);

    // 'Error Response'
    expect(utilLib.sendErrorResponse).toHaveBeenCalledWith(mockRes, 'WebApi - REPORTED ERROR', 'ERROR');

    //
  });

  //
});
