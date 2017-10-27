import { LATESTDRIVEOVER_SUCCESS, LATESTDRIVEOVER_EMPTY, LATESTDRIVEOVER_FAILED, LATESTDRIVEOVER_RESET} from 'constants/actionTypes';
import DashboardReducer from 'reducers/DashboardReducer';

// const initialState = { data: {}, empty: false, };
// const DashboardReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LATESTDRIVEOVER_SUCCESS:
//       return { ...state, empty: false, data: action.data };
//     case LATESTDRIVEOVER_EMPTY:
//       return { ...state, empty: true };
//     case LATESTDRIVEOVER_FAILED:
//       return { ...state, error: action.error };
//     case LATESTDRIVEOVER_RESET:
//       return { ...state, empty: false, error: undefined };
//     default:
//       return state;
//   }
// };

let initialState;
let state;

/* eslint-disable new-cap */
describe('test the different states', () => {
  beforeEach(() => {
    initialState = { data: {}, empty: false, };
  });

  test('initial state is returned if action unmatched', () => {
    const action = {
      type: 'DEFAULT',
      data: 'testing',
      error: 'new error'
    };

    const result = DashboardReducer(undefined, 'invalid');

    expect(action.type).toEqual('DEFAULT');
    expect(result).toEqual({ ...initialState });
  });

  test('state passed in is returned if action unmatched', () => {
    const action = {
      type: 'DEFAULT',
      data: 'testing',
      error: 'new error'
    };

    const result = DashboardReducer(false, 'invalid');

    expect(action.type).toEqual('DEFAULT');
    expect(result).toEqual(false);
  });

  test('undefned state passed in with valid action returns initial state', () => {
    const action = {
      type: 'DEFAULT',
      data: 'testing',
      error: 'new error'
    };

    const result = DashboardReducer(undefined, action);

    expect(action.type).toEqual('DEFAULT');
    expect(result).toEqual({ ...initialState });
  });

  test('success', () => {
    const action = {
      type: LATESTDRIVEOVER_SUCCESS,
      data: 'testing'
    };

    const result = DashboardReducer(state = initialState, action);

    expect(action.type).toEqual(LATESTDRIVEOVER_SUCCESS);
    expect(result).toEqual({ ...state, empty: false, data: action.data });
  });

  test('empty', () => {
    const action = {
      type: LATESTDRIVEOVER_EMPTY,
      data: 'testing'
    };

    const result = DashboardReducer(state = initialState, action);

    expect(action.type).toEqual(LATESTDRIVEOVER_EMPTY);
    expect(result).toEqual({ ...state, empty: true });
  });

  test('reset', () => {
    const action = {
      type: LATESTDRIVEOVER_RESET,
      data: 'testing',
      error: 'new error'
    };

    const result = DashboardReducer(state = initialState, action);

    expect(action.type).toEqual(LATESTDRIVEOVER_RESET);
    expect(result).toEqual({ ...state, empty: false, error: undefined });
  });

  test('defaul', () => {
    const action = {
      type: 'DEFAULT',
      data: 'testing',
      error: 'new error'
    };

    const result = DashboardReducer(state = initialState, action);

    expect(action.type).toEqual('DEFAULT');
    expect(result).toEqual({ ...state });
  });

  //
});
/* eslint-enable new-cap */
