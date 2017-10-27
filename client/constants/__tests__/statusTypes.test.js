// load the config file that will be tested
import * as types from 'constants/statusTypes.js';

// will also report '__esModule'
const countProperties = (obj) => {
  let count = 0;
  Reflect.ownKeys(obj).forEach(k => { if (k.indexOf('__') !== 0) { count++; } });
  return count;
};

describe('ActionTypes are defined ', () => {
  //
  test('The correct number of values hould be defined', () => {
    expect(countProperties(types)).toEqual(12);
  });

  test('OK should be defined', () => {
    expect(types.OK).toBeDefined();
  });

  test('CREATED should be defined', () => {
    expect(types.CREATED).toBeDefined();
  });

  test('ACCEPTED should be defined', () => {
    expect(types.ACCEPTED).toBeDefined();
  });

  test('NO_CONTENT should be defined', () => {
    expect(types.NO_CONTENT).toBeDefined();
  });

  test('BAD_REQUEST should be defined', () => {
    expect(types.BAD_REQUEST).toBeDefined();
  });

  test('UNAUTHORIZED should be defined', () => {
    expect(types.UNAUTHORIZED).toBeDefined();
  });

  test('FORBIDDEN should be defined', () => {
    expect(types.FORBIDDEN).toBeDefined();
  });

  test('NOT_FOUND should be defined', () => {
    expect(types.NOT_FOUND).toBeDefined();
  });

  test('NOT_ACCEPTABLE should be defined', () => {
    expect(types.NOT_ACCEPTABLE).toBeDefined();
  });

  test('CONFLICT should be defined', () => {
    expect(types.CONFLICT).toBeDefined();
  });

  test('RESET_CONTENT should be defined', () => {
    expect(types.RESET_CONTENT).toBeDefined();
  });

  test('INTERNAL_SERVER_ERROR should be defined', () => {
    expect(types.INTERNAL_SERVER_ERROR).toBeDefined();
  });

  //
});
