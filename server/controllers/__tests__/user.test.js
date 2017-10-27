import httpMocks from 'node-mocks-http'; // defines mock request & response object
import status from 'http-status';

import {
  get,
  update,
} from 'controllers/user';

import * as userLib from 'lib/user';

// ********************
// Mock Wrap 'user/Lib'
// ********************
jest.mock('lib/user');

// import the mock user record
const mockUserFull = {
  email: 'test@test.com',
  password: 'test',
  roles: ['driver'],
  preferences: {
    language: 'en',
    presureUnits: 'psi',
    depthUnits: 'mm',
  },
  registrations: [
    {
      vehicleId: 90,
      plate: 'XX00 TST',
      normalizedPlate: 'XX00TST',
      fromDate: '2017-08-01T08:06:22.880',
      lastViewedDate: '2017-08-01T08:06:22.880',
      isNewVehicleToUser: false,
      isRegistered: true,
      ideal: {
        depth: 6,
        pressures: [
          {
            id: '11',
            pressure: 234.422
          },
          {
            id: '12',
            pressure: 234.422
          },
          {
            id: '21',
            pressure: 234.422
          },
          {
            id: '22',
            pressure: 234.422
          }
        ]
      }
    },
  ],
  personal: {
    greeting: 'Hi',
    name: {
      foreName: 'Test',
      lastName: 'User'
    }
  },
};

const mockUserAccount = {
  email: 'test@test.com',
  password: 'test',
  roles: ['driver'],
  preferences: {
    language: 'en',
    presureUnits: 'psi',
    depthUnits: 'mm',
  },
  registrations: [
    {
      vehicleId: 90,
      plate: 'XX00 TST',
      normalizedPlate: 'XX00TST',
      fromDate: '2017-08-01T08:06:22.880',
      lastViewedDate: '2017-08-01T08:06:22.880',
      isNewVehicleToUser: false,
      ideal: {
        depth: 6,
        pressures: []
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

const mockUserDriveover = {
  roles: ['driver'],
  preferences: {
    language: 'en',
    presureUnits: 'psi',
    depthUnits: 'mm',
  },
  registrations: [
    {
      vehicleId: 90,
      plate: 'XX00 TST',
      normalizedPlate: 'XX00TST',
      fromDate: '2017-08-01T08:06:22.880',
      lastViewedDate: '2017-08-01T08:06:22.880',
      isNewVehicleToUser: true,
      ideal: {
        depth: 6,
        pressures: []
      }
    },
  ],
};

describe('User Get', () => {
  //

  beforeEach(() => {
    userLib.sendOKResponse = jest.fn();
    userLib.isUserRegistered.mockClear();
    userLib.hasUserAcceptedTerms.mockClear();
  });

  // message = 'No Contents'
  test('Should get DriverOver ONLY users details', () => {
    //
    const mockReq = httpMocks.createRequest({
      user: mockUserDriveover,
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    userLib.isUserRegistered.mockReturnValue(false);
    userLib.hasUserAcceptedTerms.mockReturnValue(false);

    get(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(userLib.isUserRegistered).toHaveBeenCalledTimes(2);
    // expect(userLib.hasUserAcceptedTerms).toHaveBeenCalledTimes(1);
    expect(userLib.sendOKResponse).toHaveBeenCalledTimes(1);

    expect(userLib.sendOKResponse).toHaveBeenCalledWith(mockReq, {});
    //
  });

  test('Should get REGISTERED ONLY users details', () => {
    //
    const mockReq = httpMocks.createRequest({
      user: mockUserDriveover,
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    userLib.isUserRegistered.mockReturnValue(true);
    userLib.hasUserAcceptedTerms.mockReturnValue(false);

    get(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(userLib.isUserRegistered).toHaveBeenCalledTimes(2);
    // expect(userLib.hasUserAcceptedTerms).toHaveBeenCalledTimes(1);
    expect(userLib.sendOKResponse).toHaveBeenCalledTimes(1);

    expect(userLib.sendOKResponse).toHaveBeenCalledWith(mockReq, {});
    //
  });

  test('Should get TERMS-ACCEPTED users details', () => {
    //
    const mockReq = httpMocks.createRequest({
      user: mockUserDriveover,
    });

    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    userLib.isUserRegistered.mockReturnValue(true);
    userLib.hasUserAcceptedTerms.mockReturnValue(true);

    get(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(userLib.isUserRegistered).toHaveBeenCalledTimes(1);
    expect(userLib.hasUserAcceptedTerms).toHaveBeenCalledTimes(1);
    expect(userLib.sendOKResponse).toHaveBeenCalledTimes(1);

    expect(userLib.sendOKResponse).toHaveBeenCalledWith(mockReq, {});
    //
  });

  //
});
