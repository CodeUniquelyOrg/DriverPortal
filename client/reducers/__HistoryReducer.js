import {
  HISTORY_SUCCESS,
} from 'constants/actionTypes';

// Initial State
const initialState = { data: [] };

const HistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_SUCCESS:
      return { ...state, data: action.data };

    default:
      return state;
  }
};

export default HistoryReducer;

