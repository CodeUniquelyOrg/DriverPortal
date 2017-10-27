// load the config file that will be tested
import * as types from 'constants/actionTypes.js';

const countProperties = (obj) => {
  let count = 0;
  Reflect.ownKeys(obj).forEach(k => { if (k.indexOf('__') !== 0) { count++; } });
  return count;
};

describe('ActionTypes are defined ', () => {
  //

  test('The correct number of values hould be defined', () => {
    expect(countProperties(types)).toEqual(19);
  });

  test('SWITCH_LANGUAGE should be defined', () => {
    expect(types.SWITCH_LANGUAGE).toBeDefined();
  });

  test('REFRESH should be defined', () => {
    expect(types.REFRESH).toBeDefined();
  });

  test('RESET should be defined', () => {
    expect(types.RESET).toBeDefined();
  });

  test('CLEAR should be defined', () => {
    expect(types.CLEAR).toBeDefined();
  });

  test('ERROR should be defined', () => {
    expect(types.ERROR).toBeDefined();
  });

  test('EXCEPTION should be defined', () => {
    expect(types.EXCEPTION).toBeDefined();
  });

  test('SPINNER_ON should be defined', () => {
    expect(types.SPINNER_ON).toBeDefined();
  });

  test('SPINNER_OFF should be defined', () => {
    expect(types.SPINNER_OFF).toBeDefined();
  });

  test('REGISTERED should be defined', () => {
    expect(types.REGISTERED).toBeDefined();
  });

  test('TERMS_ACCEPTED should be defined', () => {
    expect(types.TERMS_ACCEPTED).toBeDefined();
  });

  test('LOGGED_IN should be defined', () => {
    expect(types.LOGGED_IN).toBeDefined();
  });

  test('LOGGED_OUT should be defined', () => {
    expect(types.LOGGED_OUT).toBeDefined();
  });

  test('VALIDATE_SUCCESS should be defined', () => {
    expect(types.VALIDATE_SUCCESS).toBeDefined();
  });

  test('LATESTDRIVEOVER_SUCCESS should be defined', () => {
    expect(types.LATESTDRIVEOVER_SUCCESS).toBeDefined();
  });

  test('USER_GET_SUCCESS should be defined', () => {
    expect(types.USER_GET_SUCCESS).toBeDefined();
  });

  test('USER_SET_SUCCESS should be defined', () => {
    expect(types.USER_SET_SUCCESS).toBeDefined();
  });

  test('HISTORY_SUCCESS should be defined', () => {
    expect(types.HISTORY_SUCCESS).toBeDefined();
  });

  test('SHARE_SUCCESS should be defined', () => {
    expect(types.SHARE_SUCCESS).toBeDefined();
  });

  test('UNSHARE_SUCCESS should be defined', () => {
    expect(types.UNSHARE_SUCCESS).toBeDefined();
  });

  //
});
