import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// getting properties and sub properties
import objectPath from 'object-path';

// Imports
import { getUser, setUser } from 'actions/UserActions';
// import { refresh } from 'actions/AppActions';
import { areTermsAccepted } from 'reducers/AppReducer';
import PersonalWidget from 'components/PersonalWidget';

// Styling
import styles from './styles.css';

class PersonalPage extends Component {
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
    // this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getUser());
  }

  onUpdate(data) {
    const user = {
      personal: {
        greeting: data.greeting,
        name: {
          pronoun: data.pronoun,
          foreName: data.foreName,
          lastName: data.lastName,
        },
      }
    };
    this.props.dispatch(setUser(user));
  }

  // refresh() {
  //   this.props.dispatch(refresh());
  // }

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
    const personalProps = {
      greeting: objectPath.get(user, 'personal.greeting', ''),
      pronoun: objectPath.get(user, 'personal.name.pronoun', ''),
      foreName: objectPath.get(user, 'personal.name.foreName', ''),
      lastName: objectPath.get(user, 'personal.name.lastName', ''),
    };

    return (
      <div>
        <PersonalWidget
          personal={personalProps}
          update={this.onUpdate}
          /* refresh={this.refresh} */
        />
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return { ...state.user, termsAccepted: areTermsAccepted(state) };
};

export default connect(mapStateToProps)(PersonalPage);
