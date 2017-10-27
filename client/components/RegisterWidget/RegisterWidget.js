import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import Password from 'components/Password';

// Import Style
import styles from './style.css';

export class RegisterWidget extends Component {
  static propTypes = {
    register: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  }

  onRegister = () => {
    const forenameRef = this.refs.forename;
    const surnameRef = this.refs.surname;
    const emailRef = this.refs.email;
    const passwordRef = this.passwordRef;
    if (forenameRef.value && surnameRef.value && emailRef.value && passwordRef.value) { // && contentRef.value) {
      this.props.register(forenameRef.value, surnameRef.value, emailRef.value, passwordRef.value);
    }
  };

  render() {
    return (
      <div className={styles.form}>
        <div className={styles.formContent}>
          <h2 className={styles.formTitle}><FormattedMessage id="register" /></h2>
          <div className={styles.formRow}>
            <input placeholder={this.props.intl.messages.forename} className={styles.formField} ref="forename" />
          </div>
          <div className={styles.formRow}>
            <input placeholder={this.props.intl.messages.surname} className={styles.formField} ref="surname" />
          </div>
          <div className={styles.formRow}>
            <input type="email" placeholder={this.props.intl.messages.email} className={styles.formField} ref="email" />
          </div>
          <div className={styles.formRow}>
            <Password ref={el => { this.passwordRef = el; }} placeholder={this.props.intl.messages.password} />
          </div>
          <div className={styles.formRow}>
            <a className={styles.submitButton} href="#" onClick={this.onRegister}><FormattedMessage id="register" /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(RegisterWidget);
