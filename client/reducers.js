/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from 'reducers/AppReducer';
import dashboard from 'reducers/DashboardReducer';
import error from 'reducers/ErrorReducer';
import intl from 'reducers/IntlReducer';
import user from 'reducers/UserReducer';
import validate from 'reducers/ValidateReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  dashboard,
  error,
  intl,
  user,
  validate,
});
