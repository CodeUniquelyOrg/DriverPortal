import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Imports
import { getUser, setUser } from 'actions/UserActions';
import { switchLanguage } from 'actions/IntlActions';
import { areTermsAccepted } from 'reducers/AppReducer';
import PreferencesWidget from 'components/PreferencesWidget';

// Styling
import styles from './styles.css';

class PreferencesPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
    error: PropTypes.object,
    termsAccepted: PropTypes.bool,
  };
  static defaultProps = {
    error: undefined,
    termsAccepted: false,
  };

  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getUser());
  }

  // create a partial user object containing
  // only properties that have been updated.
  onUpdate(data) {
    const user = {
      preferences: {
        pressureUnits: data.pressure,
        depthUnits: data.depth,
        language: data.language,
      }
    };
    this.props.dispatch(setUser(user));
  }

  render() {
    const {
      user,
      error,
      termsAccepted,
    } = this.props;

    if (!user) {
      return null;
    }

    // redirect to the ERROR page
    if (error) {
      console.warn('ERROR DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    // if user has not termsAccepted
    if (!termsAccepted) {
      console.warn('TERMS HAVE NOT BEEN ACCEPTED - REDIRECT TO DASHBOARD'); // eslint-disable-line no-console
      return <Redirect to="/" push />;
    }

    // retrieve the units
    const depthUnits = user.preferences && user.preferences.depthUnits;
    const pressureUnits = user.preferences && user.preferences.pressureUnits;
    const lang = user.preferences && user.preferences.language;

    return (
      <div>
        <PreferencesWidget language={lang} pressure={pressureUnits} depth={depthUnits} update={this.onUpdate} switchLanguage={lang => this.props.dispatch(switchLanguage(lang))} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.user, termsAccepted: areTermsAccepted(state) };
};

export default connect(mapStateToProps)(PreferencesPage);
