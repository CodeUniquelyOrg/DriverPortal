import { RESET, ERROR, EXCEPTION } from 'constants/actionTypes';
import { reset, errorOccurred, exceptionOccurred } from 'actions/ErrorActions';

import { BAD_REQUEST } from 'constants/statusTypes';

describe('App Actions', () => {
  //
  test('should return the correct type for reset', () => {
    const result = reset();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(RESET);
  });

  test('should return the correct type for errorOccurred', () => {
    const result = errorOccurred();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(ERROR);
  });

  test('should return the correct type for error passed to errorOccurred', () => {
    const result = errorOccurred(BAD_REQUEST, 'error');
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(ERROR);
    expect(result.error).toBeDefined();
    expect(result.error).toEqual('error');
  });

  test('should return the correct type for exceptionOccurred', () => {
    const result = exceptionOccurred();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(EXCEPTION);
  });

  test('should return the correct type for error passed to exceptionOccurred', () => {
    const result = exceptionOccurred('error');
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(EXCEPTION);
    expect(result.error).toBeDefined();
    expect(result.error).toEqual('internalservererror');
  });
  //
});
