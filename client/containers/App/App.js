import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
// import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

// Components to this Page
import DevTools from 'components/DevTools/DevTools';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import LoaderSpinner from 'components/LoaderSpinner';

// Import reducer utilities
import { isLoggedIn, isSpinnerOn, isRegistered, areTermsAccepted } from 'reducers/AppReducer';
import { hasLogin } from 'services/tokens';

// Import Actions
import { switchLanguage } from 'actions/IntlActions';
import { spinnerOn, spinnerOff, loggedIn } from 'actions/AppActions';

// load the users details
import { getUser } from 'actions/UserActions';

// Import Style
import styles from './App.css';

// class extends Component {
export class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    spinner: PropTypes.bool,
    // registered: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    // termsAccepted: PropTypes.bool,
  };

  static defaultProps = {
    isLoggedIn: false,
    registered: false,
    termsAccepted: false,
  };

  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    if (hasLogin()) {
      console.log('Has LOGGED IN'); // eslint-disable-line no-console
      this.props.dispatch(loggedIn());
    }
    this.props.dispatch(getUser());
  }

  render() {
    const {
      route,
      spinner,
      isLoggedIn,
    } = this.props;

    let spinnerContent;
    if (spinner === true) {
      spinnerContent = <LoaderSpinner />;
    }

    const bodyContent = (
      <div className={styles.container}>
        {
          route ? renderRoutes(route.routes) : null
        }
      </div>
    );

    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div className="fullPage">
          <Helmet
            title="Driver Portal"
            titleTemplate="%s - Portal"
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                'content': 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
          />
          <Header
            isLoggedIn={isLoggedIn}
          />
          {bodyContent}
          {spinnerContent}
          <Footer />
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    intl: state.intl,
    isLoggedIn: isLoggedIn(state),
    spinner: isSpinnerOn(state),
  };
}

export default connect(mapStateToProps)(App);
