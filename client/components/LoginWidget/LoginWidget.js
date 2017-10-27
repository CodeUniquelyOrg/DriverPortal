import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Password from 'components/Password';

// Import Style
import styles from './style.css';

export class LoginWidget extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    // intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
    this.state = {
      keyCode: 0,
    };
  }

  enabled = () => {
    const emailRef = this.emailRef;
    const passwordRef = this.passwordRef;
    return emailRef && passwordRef && emailRef.value && passwordRef.value;
  }

  onLogin = () => {
    if (this.enabled()) {
      const emailRef = this.emailRef;
      const passwordRef = this.passwordRef;
      this.props.login(emailRef.value, passwordRef.value);
    }
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13 && this.enabled()) {
      this.onLogin();
    }
    this.setState({
      keycode: e.keyCode,
    });
  }

  render() {
    const {
      messages
    } = this.props;

    const enabled = this.enabled();
    return (
      <div className={styles.form}>
        <div className={styles.formContent}>
          <h2 className={styles.formTitle}>{messages.login}</h2>
          <div className={styles.formRow}>
            <input type="email" ref={el => { this.emailRef = el; }} placeholder={messages.email} className={styles.formField} onKeyDown={this.onKeyDown} />
          </div>
          <div className={styles.formRow}>
            <Password ref={el => { this.passwordRef = el; }} placeholder={messages.password} onKeyDown={this.onKeyDown} />
          </div>
          <div className={styles.formRow}>
            <button className={styles.submitButton} onClick={this.onLogin} disabled={!enabled}>
              {messages.login}
            </button>
            <span className={styles.altButton}>
              <Link to="/register" >{messages.register}</Link>
            </span>
          </div>
        </div>
      </div>
    );
    // return (
    //   <div className={styles.form}>
    //     <div className={styles.formContent}>
    //       <h2 className={styles.formTitle}><FormattedMessage id="login" /></h2>
    //       <div className={styles.formRow}>
    //         <input type="email" placeholder={this.props.intl.messages.email} className={styles.formField} ref="email" onKeyDown={this.onKeyDown} />
    //       </div>
    //       <div className={styles.formRow}>
    //         <Password ref={el => { this.passwordRef = el; }} placeholder={this.props.intl.messages.password} onKeyDown={this.onKeyDown} />
    //       </div>
    //       <div className={styles.formRow}>
    //         <button className={styles.submitButton} onClick={this.onLogin} disabled={!enabled} >
    //           <FormattedMessage id="login" />
    //         </button>
    //         <span className={styles.altButton}>
    //           <Link to="/register" ><FormattedMessage id="register" /></Link>
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

// Only map the intl stuff on this page
const mapStateToProps = (state) => {
  return {
    messages: state.intl.messages,
  };
};

export default connect(mapStateToProps)(LoginWidget);
// export default injectIntl(LoginWidget);
