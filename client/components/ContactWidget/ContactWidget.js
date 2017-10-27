import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// services
import { required, email, mobile } from 'services/validation';

// component imports
import CheckBox from 'components/CheckBox';
import Toast from 'components/Toast';
import { Colors } from 'components/Colors';

// Import Style
import styles from './style.css';

export class ContactWidget extends Component {
  static propTypes = {
    contact: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props.contact,
      invalidForm: false,
      emailMsg: undefined,
      mobileMsg: undefined,
    };

    this.onSave = this.onSave.bind(this);
    this.validate = this.validate.bind(this);
    this.savedToast = (
      <Toast
        text={this.props.intl.messages.hasSaved}
        color={Colors.green500}
        icon="check"
        timeout={3000}
        immediate={false}
        ref={el => { this.toastRef = el; }}
      />
    );
  }

  errorToast = (errMsg) => {
    return (
      <Toast
        text={errMsg}
        color={Colors.red500}
        icon="error"
        ref={el => { this.errToastRef = el; }}
      >
        <div onClick={() => {
          this.errToastRef.close();
          this.clearError();
        }}>
          OK
        </div>
      </Toast>
    );
  };

  clearError = () => {
    this.setState({
      invalidForm: false,
    });
  };

  onSave = () => {
    if (this.validate()) {
      if (this.props.update) {
        this.props.update(this.state);
        this.toastRef.open();
      }
    } else {
      // show error msgs
      this.setState({
        invalidForm: true,
      });
    }
  };

  validate = () => {
    let validEmail = required(this.state.email);
    let emailMsg;
    let mobileMsg;
    if (validEmail) {
      validEmail = email(this.state.email);
    }
    if (!validEmail) {
      // set a state & error msg
      emailMsg = 'rubbish email';
    }

    let validMobile = required(this.state.mobile);
    if (validMobile) {
      validMobile = mobile(this.state.mobile);
    }
    if (!validMobile) {
      // set a state & error msg
      mobileMsg = 'duff mobile!!!';
    }

    this.setState({
      emailMsg,
      mobileMsg,
    });
    return validEmail && validMobile;
  }

  onChangeContactInApp = value => {
    const now = new Date();
    this.setState({
      contactInApp: value,
      contactInAppDate: now,
    });
  };

  onChangeContactBySMS = value => {
    const now = new Date();
    this.setState({
      contactBySMS: value,
      contactBySMSDate: now,
    });
  };

  onChangeContactByEmail = value => {
    const now = new Date();
    this.setState({
      contactByEmail: value,
      contactByEmailDate: now,
    });
  };

  onChangeMobile = value => {
    this.setState({
      mobile: value,
    });
  };

  onChangeEmail = value => {
    this.setState({
      email: value,
    });
  };

  // ================================================================================
  // contactInApp: objectPath.get(user, 'personal.contactBy.contactInApp', false),
  //
  // mobile: objectPath.get(user, 'personal.contactBy.mobile', '');
  // contactBySMS: objectPath.get(user, 'personal.contactBy.contactBySMS', false),
  //
  // email: objectPath.get(user, 'personal.contactBy.email', ''),
  // contactByEmail: objectPath.get(user, 'personal.contactBy.contactByEmail', false),
  // ================================================================================
  render() {
    const {
      intl,
    } = this.props;

    let errorToast;
    if (this.state.invalidForm) {
      errorToast = this.errorToast(this.state.emailMsg ? this.state.emailMsg : this.state.mobileMsg);
    }

    return (
      <div className={styles.form}>
        {this.savedToast}
        <div className={styles.formContent}>
          <h2 className={styles.formTitle}><FormattedMessage id="contact" /></h2>
          {errorToast}
          <div className={styles.formRow}>
            <label><FormattedMessage id="appExplainer" /></label>
          </div>
          <div className={styles.formRow}>
            <CheckBox value={this.state.contactInApp} onChange={this.onChangeContactInApp} label={intl.messages.appTerms} />
          </div>

          {/* mobile phone */}
          <div className={styles.formRow}>
            <label><FormattedMessage id="smsExplainer" /></label>
          </div>
          <div className={styles.formRow}>
            <input
              type="tel"
              pattern="\d*"
              maxLength={11}
              value={this.state.mobile}
              placeholder={intl.messages.mobile}
              className={styles.formField}
              onChange={e => this.onChangeMobile(e.target.value)}
              ref="mobile"
            />
          </div>
          <div className={styles.formRow}>
            <CheckBox value={this.state.contactBySMS} onChange={this.onChangeContactBySMS} label={intl.messages.smsTerms} />
          </div>

          {/* email address */}
          <div className={styles.formRow}>
            <label><FormattedMessage id="smsExplainer" /></label>
          </div>
          <div className={styles.formRow}>
            <input
              value={this.state.email}
              type="email"
              maxLength={256}
              placeholder={intl.messages.email}
              onChange={e => this.onChangeEmail(e.target.value)}
              className={styles.formField} ref="email"
            />
          </div>
          <div className={styles.formRow}>
            <CheckBox value={this.state.contactByEmail} onChange={this.onChangeContactByEmail} label={intl.messages.emailTerms} />
          </div>

          <div className={styles.formRowCentered}>
            <span className={styles.altButton}>
              <Link to="/settings" ><FormattedMessage id="back" /></Link>
            </span>
            <button className={styles.submitButton} onClick={this.onSave}><FormattedMessage id="update" /></button>
          </div>

        </div>
      </div>
    );
  }
}

export default injectIntl(ContactWidget);
