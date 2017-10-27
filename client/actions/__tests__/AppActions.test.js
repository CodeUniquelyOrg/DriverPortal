import { SPINNER_ON, SPINNER_OFF, LOGGED_IN, LOGGED_OUT, REGISTERED, TERMS_ACCEPTED } from 'constants/actionTypes';
import { spinnerOn, spinnerOff, loggedIn, loggedOut, registered, termsAccepted } from 'actions/AppActions';

describe('App Actions', () => {
  //
  test('should return the correct type for spinnerOn', () => {
    const result = spinnerOn();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(SPINNER_ON);
  });

  test('should return the correct type for spinnerOff', () => {
    const result = spinnerOff();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(SPINNER_OFF);
  });

  test('should return the correct type for loggedIn', () => {
    const result = loggedIn();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(LOGGED_IN);
  });

  test('should return the correct type for loggedOut', () => {
    const result = loggedOut();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(LOGGED_OUT);
  });

  test('should return the correct type for registered', () => {
    const result = registered();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(REGISTERED);
  });

  test('should return the correct type for termsAccepted', () => {
    const result = termsAccepted();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(TERMS_ACCEPTED);
  });
  //
});
