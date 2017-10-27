import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Imports
import { OK, NO_CONTENT, RESET_CONTENT } from 'constants/statusTypes';
import { isError, isException } from 'reducers/ErrorReducer';
import { reset } from 'actions/ErrorActions';
import { useShareCode } from 'actions/ValidateActions';
import { isValidated } from 'reducers/ValidateReducer';

// Components
import CodeInput from 'components/CodeInput';
import Toast from 'components/Toast';
import { Colors } from 'components/Colors';

import style from './style.css';

class CodeEnterPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.object,
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

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      isSharingCode: false,
    };
    this.complete = this.complete.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    const {
      router
    } = this.context;

    if (router && router.history && router.history.location) {
      const isSharingCode = router.history.location.isSharingCode || false;
      this.setState({
        isSharingCode
      });
      console.log('****isSharingCode**** ', isSharingCode); // eslint-disable-line no-console
    }
  }

  static contextTypes = {
    router: PropTypes.object
  };

  errorToast = (errMsg) => {
    return (
      <Toast
        text={errMsg}
        color={Colors.orange500}
        icon="error"
        timeout={5000}
      />
    );
  };

  // navigate to '/code/${this.state.code}'
  handleFormSubmit() {
    console.log('HANDLE FORM SUBMIT'); // eslint-disable-line no-console
    this.props.dispatch(reset());
    console.log('isSharingCode STATE ', this.state.isSharingCode); // eslint-disable-line no-console
    // if (this.state.isSharingCode) {
    //   this.props.history.push(`/share/${this.state.code}`);
    //   // this.props.dispatch(useShareCode(this.state.code));
    // } else {
    this.props.history.push(`/code/${this.state.code}/${this.state.isSharingCode}`);
    // }
  }

  changed(code, index) {
    // do something - do we care ???
  }

  complete(code, index) {
    this.setState({
      code,
    });
  }

  render() {
    const {
      error,
      isError,
      isException,
      isValidated,
    } = this.props;

    console.log('*** ON CODE ENTER PAGE'); // eslint-disable-line no-console

    if (isValidated) {
      console.log('VALIDATED THE CODE SUPPLIED'); // eslint-disable-line no-console
      // debugger; // eslint-disable-line
      return <Redirect to="/" push />;
    }

    if (isException) {
      console.warn('EXCEPTION DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    let toast;
    if (isError) {
      console.warn('A "NON OK" STATUS RETURNED'); // eslint-disable-line no-console
      if (error.status !== NO_CONTENT && error.status !== RESET_CONTENT) {
        console.warn('ERROR DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
        return <Redirect to="/error" push />;
      }
      if (error.status === NO_CONTENT) {
        toast = this.errorToast('invalidCode');
      }
      if (error.status === RESET_CONTENT) {
        toast = this.errorToast('code expired');
      }
    }

    return (
      <Route>
        <form className={style.form} onSubmit={this.handleFormSubmit}>
          {toast}
          <h1 className={style.formTitle}><FormattedMessage id="enterYourCode" /></h1>

          <div className={style.formRow}>
            <CodeInput length={9} onChanged={this.changed} onComplete={this.complete} />
          </div>

          <div className={style.formButtons}>
            <button className={style.submitButton} type="submit"><FormattedMessage id="submit" /></button>
          </div>
        </form>
      </Route>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    isError: isError(state),
    isException: isException(state),
    error: state.error,
    isValidated: isValidated(state),
  };
};

export default connect(mapStateToProps)(CodeEnterPage);
