import {
  RESET, VALIDATE_SUCCESS,
} from 'constants/actionTypes';

// Initial State
const initialState = { validated: false };

const ValidateReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET:
      // return { ...state, ...initialState };
      return { ...initialState };

    case VALIDATE_SUCCESS:
    {
      console.warn('VALIDATE_SUCCESS'); // eslint-disable-line no-console
      return { ...state, validated: true };
    }

    default:
      return state;
  }
};

/* Expose Selector Helper functions */
export const isValidated = state => !!state.validate.validated;

export default ValidateReducer;
