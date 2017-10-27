import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Imports
import { NO_CONTENT, RESET_CONTENT } from 'constants/statusTypes';
import { isError, isException } from 'reducers/ErrorReducer';
import { isLoggedIn } from 'reducers/AppReducer';
import { login } from 'actions/LoginActions';
import { clear } from 'actions/ErrorActions';

// import components
import LoginWidget from 'components/LoginWidget';

// iomport styles
import style from './style.css';

class LoginPage extends Component {
  static propTypes = {
    error: PropTypes.object,
    dispatch: PropTypes.func,
    isError: PropTypes.bool,
    isException: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
  };
  static defaultProps = {
    error: undefined,
    isError: false,
    isException: false,
    isLoggedIn: false,
  };

  constructor(props) {
    super(props);
    this.handlelogin = this.handlelogin.bind(this);
  }

  componentDidMount() {
    if (this.props.isError && this.props.error.status === NO_CONTENT) {
      this.props.dispatch(clear());
    }
  }

  // navigate to '/code/${this.state.code}'
  handlelogin(email, password) {
    this.props.dispatch(login(email, password));
  }

  render() {
    const {
      error,
      isError,
      isException,
      isLoggedIn,
      dispatch,
    } = this.props;

    if (isLoggedIn) {
      console.log('LOGIN WORKED'); // eslint-disable-line no-console
      return <Redirect to="/" push />;
    }

    if (isException) {
      console.log('EXCEPTION DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    if (isError && (error.status === NO_CONTENT || error.status === RESET_CONTENT)) {
      // dispatch(clear());
    } else if (isError) {
      console.log('HAVE A "NON OK" STATUS'); // eslint-disable-line no-console
      console.log('STATUS IS ', error.status); // eslint-disable-line no-console
      console.warn('ERROR DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    console.log('JUST DISPLAY THE LOGIN FORM'); // eslint-disable-line no-console
    return (
      <div>
        <LoginWidget login={this.handlelogin} />
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    isError: isError(state),
    isException: isException(state),
    isLoggedIn: isLoggedIn(state),
    error: state.error,
  };
};

export default connect(mapStateToProps)(LoginPage);
