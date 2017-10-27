import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // -DOM needed for LINK
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { logoff } from 'actions/LoginActions';
import { refresh } from 'actions/AppActions';

import bg from 'assets/img/header-bk.png';

// Import Style
import styles from './Header.css';

// export function Header(props, context) {
export class Header extends Component {
  //

  static propTypes = {
    dispatch: PropTypes.func,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object
  };

  logout = () => {
    this.props.dispatch(logoff());
    this.props.dispatch(refresh());
  };

  render() {
    // get the router from context
    const {
      router
    } = this.context;

    const {
      isLoggedIn,
      user,
    } = this.props;

    let userContents;
    if (isLoggedIn) {
      const userName = user && user.user && user.user.email;
      // get user.email from some context ???

      userContents = (
        <span className={styles.user}>
          <div className={styles.wrapper}>
            <Link to="/settings" >
              <span className={`material-icons ${styles.icon}`}>account_circle</span>
            </Link>
          </div>
          <span className={styles.name}>{userName}</span>
        </span>
      );
    }

    let linkConents;
    if (isLoggedIn) {
      linkConents = (
        <span className={styles.link} onClick={this.logout}>
          <FormattedMessage id="logout" />
        </span>
      );
    } else {
      let link = <Link to="/login" ><FormattedMessage id="login" /></Link>;
      if (router && router.history && router.history.location) {
        if (router.history.location.pathname === '/login') { // whatif register ??
          link = <Link to="/code" ><FormattedMessage id="code" /></Link>;
        }
      }
      linkConents = (
        <span className={styles.link}>
          {link}
        </span>
      );
    }

    return (
      <div className={styles.root}>
        {userContents}
        {linkConents}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Header);
