import {log} from 'lib/logging';
import httpMocks from 'node-mocks-http'; // defines mock request & response object

describe('describe', () => {

  test('test', () => {
    console.log = jest.fn();
    const mockRes = httpMocks.createResponse();
    const mockNext = jest.fn();
    const mockReq = {
      url: 'http://www.wheelright.com',
    };

    log(mockReq, mockRes, mockNext);

    expect(mockReq.url).toBe('http://www.wheelright.com');
    expect(mockRes).toBeDefined();
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log.mock.calls[0][0]).toEqual('ROUTE INDEX URL is ');
    expect(console.log.mock.calls[0][1]).toEqual('http://www.wheelright.com');
    
  });

});



    