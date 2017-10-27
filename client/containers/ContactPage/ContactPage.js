import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// getting properties and sub properties
import objectPath from 'object-path';

// Imports
import { getUser, setUser } from 'actions/UserActions';
import { areTermsAccepted } from 'reducers/AppReducer';
import ContactWidget from 'components/ContactWidget';

// Styling
import styles from './styles.css';

class ContactPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.object,
    user: PropTypes.object,
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

  // deal only with the properties that have been updated.
  onUpdate(data) {
    const user = {
      personal: {
        contactBy: {
          mobile: data.mobile,
          email: data.email,
          contactInApp: data.contactInApp,
          contactBySMS: data.contactBySMS,
          contactByEmail: data.contactByEmail,
          contactInAppDate: data.contactInAppDate,
          contactBySMSDate: data.contactBySMSDate,
          contactByEmailDate: data.contactByEmailDate,
        }
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

    // get the properties that will be used
    const contactProps = {
      mobile: objectPath.get(user, 'personal.contactBy.mobile', ''),
      email: objectPath.get(user, 'personal.contactBy.email', ''),
      contactInApp: objectPath.get(user, 'personal.contactBy.contactInApp', false),
      contactBySMS: objectPath.get(user, 'personal.contactBy.contactBySMS', false),
      contactByEmail: objectPath.get(user, 'personal.contactBy.contactByEmail', false),
      contactInAppDate: objectPath.get(user, 'personal.contactBy.contactInAppDate'),
      contactBySMSDate: objectPath.get(user, 'personal.contactBy.contactBySMSDate'),
      contactByEmailDate: objectPath.get(user, 'personal.contactBy.contactByEmailDate'),
    };

    return (
      <div>
        <ContactWidget contact={contactProps} update={this.onUpdate} />
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return { ...state.user, termsAccepted: areTermsAccepted(state) };
};

export default connect(mapStateToProps)(ContactPage);
