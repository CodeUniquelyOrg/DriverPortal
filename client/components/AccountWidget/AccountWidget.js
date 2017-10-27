import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// Import Style
import styles from './style.css';

export class AccountWidget extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  }

  onLogout = () => {
    if (this.props.logout) {
      this.props.logout();
    }
  };

  render() {
    return (
      <div className={styles.form}>
        <div className={styles.formContent}>
          <h2 className={styles.formTitle}><FormattedMessage id="myAccount" /></h2>
          <div className={styles.formRowCentered}>
            <span className={styles.altButton}>
              <Link to="/settings" ><FormattedMessage id="back" /></Link>
            </span>
            <button className={styles.submitButton} onClick={this.onLogout}><FormattedMessage id="logout" /></button>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(AccountWidget);
