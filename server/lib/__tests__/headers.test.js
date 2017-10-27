import httpMocks from 'node-mocks-http'; // defines mock request & response object
import { accessControlheaders } from 'lib/headers';

// any old request will do - we dont use request
const mockReq = httpMocks.createRequest({
  method: 'OPTIONS',
});

// provide a property counting function
const countProperties = (obj) => {
  return Reflect.ownKeys(obj).length;
};

// res.header('Access-Control-Allow-Origin', '*');
// res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-auth');
// res.header('X-Auth-Version', config.version);
describe('Accept Headers', () => {
  test('Check it throws when res is undefined', () => {
    const mockNext = jest.fn();
    expect(() => {
      accessControlheaders(mockReq, undefined, mockNext);
    }).toThrow();
    expect(mockNext).toHaveBeenCalledTimes(0);
  });

  test('Check accept-headers chains to next middleware', () => {
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    accessControlheaders(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('Check ALL accept-headers are set correctly', () => {
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();

    accessControlheaders(mockReq, mockRes, mockNext);

    const headers = mockRes._getHeaders();
    expect(headers['Access-Control-Allow-Origin']).toBe('*');
    expect(headers['Access-Control-Allow-Methods']).toBe('GET,PUT,POST,DELETE,OPTIONS');
    expect(headers['Access-Control-Allow-Headers']).toBe('Authorization, Content-Type, x-auth');
    expect(headers['X-Auth-Version']).toBe('1.0.0');
    expect(countProperties(headers)).toBe(4);
  });
});
