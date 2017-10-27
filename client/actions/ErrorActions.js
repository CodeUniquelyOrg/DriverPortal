// Export Constants
import { RESET, CLEAR, ERROR, EXCEPTION } from 'constants/actionTypes';

// Export Action for dealing with response => { status:xxx }
export const errorOccurred = (status, json) => {
  console.log(`A ${status} ERROR OCCURED - PASSING`); // eslint-disable-line no-console
  console.log(json); // eslint-disable-line no-console

  return {
    type: ERROR,
    status: status,
    ...json,
    // error: json.error,
    // message: json.message,
    // err: json.err;
  };
};

// Export Actions
export const exceptionOccurred = (err, message) => {
  console.log('AN EXCEPTION OCCURED - WITH'); // eslint-disable-line no-console
  console.log(err); // eslint-disable-line no-console

  return {
    type: EXCEPTION,
    status: 500,
    error: 'internalservererror',
    message: message,
    err: err,
  };
};

export const reset = () => {
  console.log('RESET CALLED'); // eslint-disable-line no-console
  return {
    type: RESET,
  };
};

export const clear = () => {
  console.log('CLEAR CALLED'); // eslint-disable-line no-console
  return {
    type: CLEAR,
  };
};
