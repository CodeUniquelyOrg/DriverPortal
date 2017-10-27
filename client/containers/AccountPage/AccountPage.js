import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


// Imports
import { removeToken } from 'services/tokens';
import { isRefresh } from 'reducers/AppReducer';

// Components
import AccountWidget from 'components/AccountWidget';

// Styling
import styles from './styles.css';

class AccountPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
    error: PropTypes.object,
    refresh: PropTypes.bool,
  };
  static defaultProps = {
    error: undefined,
  };

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      logout: false,
    };
  }

  // create a partial user object containing
  // only properties that have been updated.
  logout() {
    if (this && !this.state.logout) {
      removeToken();
      this.setState({
        logout: true
      });
    }
  }

  render() {
    const {
      user,
      error,
    } = this.props;

    if (!user) {
      return null;
    }

    // REDIRECT AFTER THE LOGOUT
    if (this.state.logout) {
      console.warn('RELOAD THE DASHBOARD'); // eslint-disable-line no-console
      return <Redirect to="/" push />;
    }
    return (
      <div>
        <AccountWidget logout={this.logout} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.user };
};

export default connect(mapStateToProps)(AccountPage);
