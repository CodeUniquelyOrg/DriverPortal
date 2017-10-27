import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { reset } from 'actions/ErrorActions';

import styles from './styles.css';

class ErrorPage extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  handleFormSubmit() {
    console.log('HANDLE FORM SUBMIT ON RESET ERROR'); // eslint-disable-line no-console
    this.props.dispatch(reset());
  }

  // =========================================
  // try to determin whattpe of error we have
  // =========================================
  // const response = {
  //   status,
  //   token,
  //   json: {
  //     error: 'internalservererror',
  //     message,
  //     err,
  //   }
  // };
  render() {
    const {
      error
    } = this.props;

    console.log('ERROR PAGE'); // eslint-disable-line no-console
    console.log(this.props); // eslint-disable-line no-console

    let id = 'errorpage';
    let message = 'Error';
    let title = 'Generic Error';

    if (error) {
      id = error.error || 'errorpage';
      if (error.err && error.err.response) {
        // HTTP Error
        title = error.err.status;
        message = error.err.response.text;
      } else if (error.err && error.err.stack) {
        // THROWN EXCEPTION
        title = error.err.message;
        message = error.err.stack;
      } else {
        // just an error string
        message = error.message || 'no error messsage present in error';
        return <Redirect to="/" push />;
      }
    }

    return (
      <div className={styles.root}>
        <form className={styles.form} onSubmit={this.handleFormSubmit}>
          <h1 className={styles.header}><FormattedMessage id={id} /></h1>
          <h2 className={styles.subheader}>{title}</h2>
          <hr/>
          <pre className={styles.pre}>
            {message}
          </pre>
          <hr/>
          <div className={styles.formRowCentered}>
            <div className={styles.formButtons}>
              <button className={styles.submitButton} type="submit"><FormattedMessage id="submit" /></button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { error: state.error };
};

export default connect(mapStateToProps)(ErrorPage);
