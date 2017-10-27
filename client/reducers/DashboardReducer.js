import {
  // LATESTDRIVEOVER_SUCCESS, HISTORY_SUCCESS,
  HISTORY_SUCCESS,
  SHARE_SUCCESS,
  UNSHARE_SUCCESS,
} from 'constants/actionTypes';

// Initial State
// const initialState = { data: {} };
const initialState = { data: [] };

const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    // case LATESTDRIVEOVER_SUCCESS:
    //   return { ...state, data: action.data };

    case HISTORY_SUCCESS:
      return { ...state, data: action.data };

    case SHARE_SUCCESS:
      return { ...state, shareCode: action.data };

    case UNSHARE_SUCCESS:
      return { ...state };

    default:
      return state;
  }
};

export default DashboardReducer;
