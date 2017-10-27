import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Imports
import { CONFLICT, RESET_CONTENT, NO_CONTENT } from 'constants/statusTypes';
import { isError, isException } from 'reducers/ErrorReducer';
import { register } from 'actions/RegisterActions';
import { areTermsAccepted, isRegistered } from 'reducers/AppReducer';

import RegisterWidget from 'components/RegisterWidget';

// UI Styling and other stuff like that
import style from './style.css';

class RegisterPage extends Component {
  static propTypes = {
    error: PropTypes.object,
    dispatch: PropTypes.func,
    isError: PropTypes.bool,
    isException: PropTypes.bool,
    isRegistered: PropTypes.bool,
  };

  static defaultProps = {
    error: undefined,
    isError: false,
    isException: false,
    isRegistered: false,
  }

  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister(forename, surname, email, password) {
    this.props.dispatch(register(forename, surname, email, password));
  }

  render() {
    const {
      error,
      isError,
      isException,
      isRegistered,
    } = this.props;

    if (isRegistered) {
      console.warn('USER IS REGISTERED - REDIRECT TO TERMS PAGE'); // eslint-disable-line no-console
      console.log(this.props); // eslint-disable-line no-console
      return <Redirect to="/terms" push />;
    }

    if (isException) {
      console.log('EXCEPTION DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    // redirect to the ERROR page unless its a conflict
    if (isError && (error.status === NO_CONTENT || error.status === RESET_CONTENT)) {
      // dispatch(clear());
    } else if (isError && error.status === CONFLICT) {
      // show some toast widget and then stey here
    } else if (isError) {
      return <Redirect to="/error" push />;
    }

    // redirect to the TERMS page
    return (
      <div>
        <RegisterWidget register={this.handleRegister} />
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    /* ...state.register, */ isRegistered: isRegistered(state),
    isError: isError(state),
    isException: isException(state),
    error: state.error,
  };
};

export default connect(mapStateToProps)(RegisterPage);
