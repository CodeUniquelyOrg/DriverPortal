import status from 'http-status';

import {
  cleanUpResponse,
  sendNoContentResponse,
  sendOKResponse,
  sendCreatedResponse,
  sendAcceptResponse,
  sendBadRequestResponse,
  sendUnauthorizedResponse,
  sendForbiddenResponse,
  sendErrorResponse,
} from 'lib/utils';

let mockRes;

describe('Utils sendNoContentResponse', () => {
  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have no unexpected structure in the cleaned response', () => {
    const cleaned = cleanUpResponse(mockRes);
    expect(cleaned.res).toBeUndefined();
    expect(cleaned.request).toBeUndefined();
    expect(cleaned.req).toBeUndefined();
    expect(cleaned.header).toBeUndefined();
    expect(cleaned._events).toBeUndefined();
    expect(cleaned._eventsCount).toBeUndefined();
    expect(cleaned._maxListeners).toBeUndefined();
    expect(cleaned.files).toBeUndefined();
    expect(cleaned.buffered).toBeUndefined();
    expect(cleaned.setEncoding).toBeUndefined();
    expect(cleaned.redirect).toBeUndefined();
    expect(cleaned.redirects).toBeUndefined();
    expect(cleaned.links).toBeUndefined();
  });
});

describe('Utils sendNoContentResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  // message = 'No Contents'
  test('Should have expected structure with just a response', () => {
    sendNoContentResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.NO_CONTENT,
      token: undefined,
      json: { message: 'No Contents' },
    });
  });

  test('Should have expected structure with an undefined message', () => {
    sendNoContentResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.NO_CONTENT,
      token: undefined,
      json: { message: 'No Contents' }
    });
  });

  test('Should have expected structure with a defined message', () => {
    sendNoContentResponse(mockRes, 'testing');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.NO_CONTENT,
      token: undefined,
      json: { message: 'testing' }
    });
  });
  //
});

describe('Utils sendOKResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have expected structure with just a response', () => {
    sendOKResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.OK,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure with undefined data', () => {
    sendOKResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.OK,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure undefined data and undefined token', () => {
    sendOKResponse(mockRes, undefined, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.OK,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure with data', () => {
    sendOKResponse(mockRes, { test: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.OK,
      token: undefined,
      json: { test: 'testing' }
    });
  });

  test('Should have expected structure with a token', () => {
    sendOKResponse(mockRes, undefined, 'token-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.OK,
      token: 'token-string',
      json: undefined,
    });
  });

  test('Should have expected structure with data and undefined token', () => {
    sendOKResponse(mockRes, { test: 'testing' }, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.OK,
      token: undefined,
      json: { test: 'testing' },
    });
  });

  test('Should have expected structure with data and a token', () => {
    sendOKResponse(mockRes, { test: 'testing' }, 'token-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.OK,
      token: 'token-string',
      json: { test: 'testing' },
    });
  });

  //
});

describe('Utils sendCreatedResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have expected structure with just a response', () => {
    sendCreatedResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.CREATED,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure with undefined data', () => {
    sendCreatedResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.CREATED,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure undefined data and undefined token', () => {
    sendCreatedResponse(mockRes, undefined, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.CREATED,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure with data', () => {
    sendCreatedResponse(mockRes, { test: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.CREATED,
      token: undefined,
      json: { test: 'testing' }
    });
  });

  test('Should have expected structure with a token', () => {
    sendCreatedResponse(mockRes, undefined, 'token-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.CREATED,
      token: 'token-string',
      json: undefined,
    });
  });

  test('Should have expected structure with data and undefined token', () => {
    sendCreatedResponse(mockRes, { test: 'testing' }, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.CREATED,
      token: undefined,
      json: { test: 'testing' },
    });
  });

  test('Should have expected structure with data and a token', () => {
    sendCreatedResponse(mockRes, { test: 'testing' }, 'token-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.CREATED,
      json: { test: 'testing' },
      token: 'token-string'
    });
  });

  //
});

describe('Utils sendAcceptResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have expected structure with just a response', () => {
    sendAcceptResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.ACCEPTED,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure with undefined data', () => {
    sendAcceptResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.ACCEPTED,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure undefined data and undefined token', () => {
    sendAcceptResponse(mockRes, undefined, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.ACCEPTED,
      token: undefined,
      json: undefined,
    });
  });

  test('Should have expected structure with data', () => {
    sendAcceptResponse(mockRes, { test: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.ACCEPTED,
      token: undefined,
      json: { test: 'testing' }
    });
  });

  test('Should have expected structure with a token', () => {
    sendAcceptResponse(mockRes, undefined, 'token-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.ACCEPTED,
      token: 'token-string',
      json: undefined,
    });
  });

  test('Should have expected structure with data and undefined token', () => {
    sendAcceptResponse(mockRes, { test: 'testing' }, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.ACCEPTED,
      token: undefined,
      json: { test: 'testing' },
    });
  });

  test('Should have expected structure with data and a token', () => {
    sendAcceptResponse(mockRes, { test: 'testing' }, 'token-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.ACCEPTED,
      token: 'token-string',
      json: { test: 'testing' },
    });
  });

  //
});

describe('Utils sendBadRequestResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have expected structure with just a response', () => {
    sendBadRequestResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.BAD_REQUEST,
      token: undefined,
      json: {
        error: 'badrequest',
        message: 'Bad Request',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined error string', () => {
    sendBadRequestResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.BAD_REQUEST,
      token: undefined,
      json: {
        error: 'badrequest',
        message: 'Bad Request',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined in both', () => {
    sendBadRequestResponse(mockRes, undefined, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.BAD_REQUEST,
      token: undefined,
      json: {
        error: 'badrequest',
        message: 'Bad Request',
        err: {}
      },
    });
  });

  test('Should have expected structure with an error string', () => {
    sendBadRequestResponse(mockRes, 'error-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.BAD_REQUEST,
      token: undefined,
      json: {
        error: 'badrequest',
        message: 'error-string',
        err: {},
      },
    });
  });

  test('Should have expected structure with an error object', () => {
    sendBadRequestResponse(mockRes, undefined, { error: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.BAD_REQUEST,
      token: undefined,
      json: {
        error: 'badrequest',
        message: 'Bad Request',
        err: { error: 'testing' }
      },
    });
  });

  test('Should have expected structure with both', () => {
    sendBadRequestResponse(mockRes, 'error-string', { error: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.BAD_REQUEST,
      token: undefined,
      json: {
        error: 'badrequest',
        message: 'error-string',
        err: { error: 'testing' }
      },
    });
  });

  //
});

describe('Utils sendUnauthorizedResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have expected structure with just a response', () => {
    sendUnauthorizedResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.UNAUTHORIZED,
      token: undefined,
      json: {
        error: 'unauthorized',
        message: 'You are unauthorized for this request',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined error string', () => {
    sendUnauthorizedResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.UNAUTHORIZED,
      token: undefined,
      json: {
        error: 'unauthorized',
        message: 'You are unauthorized for this request',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined in both', () => {
    sendUnauthorizedResponse(mockRes, undefined, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.UNAUTHORIZED,
      token: undefined,
      json: {
        error: 'unauthorized',
        message: 'You are unauthorized for this request',
        err: {}
      },
    });
  });

  test('Should have expected structure with an error string', () => {
    sendUnauthorizedResponse(mockRes, 'error-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.UNAUTHORIZED,
      token: undefined,
      json: {
        error: 'unauthorized',
        message: 'error-string',
        err: {},
      },
    });
  });

  test('Should have expected structure with an error object', () => {
    sendUnauthorizedResponse(mockRes, undefined, { error: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.UNAUTHORIZED,
      token: undefined,
      json: {
        error: 'unauthorized',
        message: 'You are unauthorized for this request',
        err: { error: 'testing' }
      },
    });
  });

  test('Should have expected structure with both', () => {
    sendUnauthorizedResponse(mockRes, 'error-string', { error: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.UNAUTHORIZED,
      token: undefined,
      json: {
        error: 'unauthorized',
        message: 'error-string',
        err: { error: 'testing' }
      },
    });
  });

  //
});

describe('Utils sendForbiddenResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have expected structure with just a response', () => {
    sendForbiddenResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.FORBIDDEN,
      token: undefined,
      json: {
        error: 'forbidden',
        message: 'You are forbidden to make this request',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined error', () => {
    sendForbiddenResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.FORBIDDEN,
      token: undefined,
      json: {
        error: 'forbidden',
        message: 'You are forbidden to make this request',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined both', () => {
    sendForbiddenResponse(mockRes, undefined, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.FORBIDDEN,
      token: undefined,
      json: {
        error: 'forbidden',
        message: 'You are forbidden to make this request',
        err: {}
      },
    });
  });

  test('Should have expected structure with an error string', () => {
    sendForbiddenResponse(mockRes, 'error-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.FORBIDDEN,
      token: undefined,
      json: {
        error: 'forbidden',
        message: 'error-string',
        err: {},
      },
    });
  });

  test('Should have expected structure with an error object', () => {
    sendForbiddenResponse(mockRes, undefined, { error: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.FORBIDDEN,
      token: undefined,
      json: {
        error: 'forbidden',
        message: 'You are forbidden to make this request',
        err: { error: 'testing' }
      },
    });
  });

  test('Should have expected structure with both', () => {
    sendForbiddenResponse(mockRes, 'error-string', { error: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.FORBIDDEN,
      token: undefined,
      json: {
        error: 'forbidden',
        message: 'error-string',
        err: { error: 'testing' }
      },
    });
  });

  //
});

describe('Utils sendErrorResponse', () => {
  //

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
  });

  test('Should have expected structure with just a response', () => {
    sendErrorResponse(mockRes);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'internal server error',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined error', () => {
    sendErrorResponse(mockRes, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'internal server error',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined error and undefined message', () => {
    sendErrorResponse(mockRes, undefined, undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'internal server error',
        err: {}
      },
    });
  });

  test('Should have expected structure with undefined error and message', () => {
    sendErrorResponse(mockRes, 'testing', undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'testing',
        err: {}
      },
    });
  });

  test('Should have expected structure with just an error string', () => {
    sendErrorResponse(mockRes, 'error-string');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'error-string',
        err: {}
      },
    });
  });

  test('Should have expected structure with just an error object', () => {
    sendErrorResponse(mockRes, undefined, { test: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'internal server error',
        err: { test: 'testing' }
      },
    });
  });

  test('Should have expected structure with error string and undefined message', () => {
    sendErrorResponse(mockRes, 'error-string', undefined);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'error-string',
        err: {}
      },
    });
  });

  test('Should have expected structure with error object and undefined message', () => {
    sendErrorResponse(mockRes, undefined, { test: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'internal server error',
        err: { test: 'testing' }
      },
    });
  });

  test('Should have expected structure with error string and error message', () => {
    sendErrorResponse(mockRes, 'error-string', 'testing');
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'error-string',
        err: 'testing'
      },
    });
  });

  test('Should have expected structure with error object and message', () => {
    sendErrorResponse(mockRes, 'testing', { test: 'testing' });
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: status.INTERNAL_SERVER_ERROR,
      token: undefined,
      json: {
        error: 'internalservererror',
        message: 'testing',
        err: { test: 'testing' }
      },
    });
  });

  //
});
