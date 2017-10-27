import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

// Imports
import { OK, NO_CONTENT, RESET_CONTENT } from 'constants/statusTypes';
import { getLatestDriveOver } from 'actions/DashboardActions';
import { isError, isException } from 'reducers/ErrorReducer';
import { isValidated } from 'reducers/ValidateReducer';
import { validateCode, useShareCode } from 'actions/ValidateActions';

class CodeSuppliedPage extends Component {
  static propTypes = {
    error: PropTypes.object,
    dispatch: PropTypes.func,
    isError: PropTypes.bool,
    isException: PropTypes.bool,
    isValidated: PropTypes.bool,
  };
  static defaultProps = {
    error: undefined,
    isError: false,
    isException: false,
    isValidated: false,
  };

  componentDidMount() {
    const params = this.props.match.params;
    const code = params.code || '';
    const share = (params.share || false) === 'true';
    console.log('PARAMS.SHARE ', params.share); // eslint-disable-line no-console

    const func = (share) ? useShareCode : validateCode;
    this.props.dispatch(func(code));

    // if (share) {
    //   this.props.dispatch(useShareCode(code));
    // } else {
    //   this.props.dispatch(validateCode(code));
    // }
  }

  render() {
    const {
      error,
      isError,
      isException,
      isValidated,
    } = this.props;

    console.log('ON CODE SUPPLIED PAGE with code ', this.props.match.params.code); // eslint-disable-line no-console
    // debugger; // eslint-disable-line

    if (isValidated) {
      console.log('VALIDATED THE CODE SUPPLIED'); // eslint-disable-line no-console
      return <Redirect to="/" push />;
    }

    if (isException) {
      console.log('EXCEPTION DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    if (isError) {
      console.log('HAVE A "NON OK" STATUS'); // eslint-disable-line no-console
      console.log('STATUS IS ', error.status); // eslint-disable-line no-console
      if (error.status === RESET_CONTENT) {
        console.warn('CODE MATCHED BUT NO VEHICLE ANY MORE'); // eslint-disable-line no-console
        return <Redirect to="/code" push />;
      } else if (error.status !== NO_CONTENT) {
        console.warn('ERROR DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
        return <Redirect to="/error" push />;
      }
      console.warn('MUST HAVE BEEN A "NO CONTENT"'); // eslint-disable-line no-console
      return <Redirect to="/code" push />;
    }

    console.log('WAITING FOR RESPONSE....'); // eslint-disable-line no-console
    return null;
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    isError: isError(state),
    isException: isException(state),
    isValidated: isValidated(state),
    error: state.error,
  };
};

export default connect(mapStateToProps)(CodeSuppliedPage);
