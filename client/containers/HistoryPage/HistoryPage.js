import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Import Actions
import { OK, NO_CONTENT } from 'constants/statusTypes';
import { getHistory } from 'actions/historyActions';
import { isError, isException } from 'reducers/ErrorReducer';

// api calling support
import callApi from 'services/apiCaller';

// Components
import Car from 'components/Car/Car';

class HistoryPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    // match: {
    //   code: PropTypes.string.isRequired,
    // },
    // driveOver: PropTypes.object,
    // empty: PropTypes.bool,
    isError: PropTypes.bool,
    isException: PropTypes.bool,
    data: PropTypes.array,
    user: PropTypes.object,
    error: PropTypes.object,
  };

  static defaultProps = {
    // user: undefined,
    error: undefined,
    isError: false,
    isException: false,
  }

  componentDidMount() {
    const vehicleId = this.props.match.params.vehicleId;

    //
    // ONLY IF LOGGED IN || NOT A REDIRECT ....
    //
    this.props.dispatch(getHistory());
  }

  render() {
    const {
      data,
      user,
      error,
      isError,
      isException,
    } = this.props;

    if (isException) {
      console.warn('EXCEPTION DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    // if (isError) {
    //   console.warn('ERROR DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
    //   return <Redirect to="/error" push />;
    // }

    // if (empty === true) {
    //   return <Redirect to="/code" push />;
    // }

    // if (!data.user || !data.tyres) {
    if (!data) {
      console.warn('NO DATA'); // eslint-disable-line no-console
      return null;
    }

    if (!user) {
      console.warn('NO USER'); // eslint-disable-line no-console
      return null;
    }

    if (!user.preferences) {
      console.warn('NO USER => PREFERENCES'); // eslint-disable-line no-console
    }

    if (data) {
      console.log('DATA IS'); // eslint-disable-line no-console
      console.log(data); // eslint-disable-line no-console
    }

    if (user) {
      console.log('USER IS'); // eslint-disable-line no-console
      console.log(user); // eslint-disable-line no-console
    }

    const units = {
      pressure: user.preferences.pressureUnits,
      depth: user.preferences.depthUnits,
    };

    const list = data.map(item => {
      const vid = item.vehicleId;
      const history = item.history;

      const historyList = history.map(h => {
        const tyreList = h.tyres.map(t => {
          return (
            <li>{t.pressure}</li>
          );
        });

        return (
          <li>
            {h.timestamp}
            <ul>
              {tyreList}
            </ul>
          </li>
        );
      });

      return (
        <li>
          {vid}
          <ul>
            {historyList}
          </ul>
        </li>
      );
    });

    return (
      <div>
        <h1>History</h1>
        <ul>{list}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.history,
    ...state.user,
    isError: isError(state),
    isException: isException(state),
    error: state.error,
  };
};

// const mapStateToProps = (state) => {
//   return { ...state.dashboard, termsAccepted: areTermsAccepted(state), isRegistered: isRegistered(state) };
// };

export default connect(mapStateToProps)(HistoryPage);
