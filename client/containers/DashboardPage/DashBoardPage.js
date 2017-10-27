import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Import Actions
import { OK, NO_CONTENT, UNAUTHORIZED, FORBIDDEN } from 'constants/statusTypes';
// import { getHistory, getLatestDriveOver } from 'actions/DashboardActions';
import { getHistory, generateShareCode, unshare, registerVehicle, removeVehicle } from 'actions/DashboardActions';
import { isError, isException } from 'reducers/ErrorReducer';
import { areTermsAccepted, isRegistered, isLoggedIn } from 'reducers/AppReducer';

// api calling support
import callApi from 'services/apiCaller';
import { hasToken } from 'services/tokens';

// Components
import debug from 'components/Debug';
import Car from 'components/Car';
import History from 'components/History';
import Toolbar from 'components/Toolbar';
import Toast from 'components/Toast';
import { Colors } from 'components/Colors';

// Styling
import styles from './styles.css';

class DashboardPage extends Component {
  static propTypes = {
    data: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    history: PropTypes.object,
    isError: PropTypes.bool,
    isException: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isRegistered: PropTypes.bool,
    shareCode: PropTypes.string,
    termsAccepted: PropTypes.bool,
    user: PropTypes.object,
  };

  static defaultProps = {
    // user: undefined,
    error: undefined,
    isError: false,
    isException: false,
    isLoggedIn: false,
    isRegistered: false,
    shareCode: undefined,
    termsAccepted: false,
  }

  constructor(props) {
    super(props);

    this.switchView = this.switchView.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.generateCode = this.generateCode.bind(this);
    this.unshareCode = this.unshareCode.bind(this);
    this.registerCurrentVehicle = this.registerCurrentVehicle.bind(this);
    this.removeCurrentVehicle = this.removeCurrentVehicle.bind(this);
    this.log = this.log.bind(this);

    this.state = {
      showHistory: false,
      // vehicleIndex: 0,
    };
  }

  componentDidMount() {
    // this.props.dispatch(getLatestDriveOver());
    // ONLY IF NOT A REDIRECT || LOGGED IN
    if (hasToken()) {
      this.props.dispatch(getHistory());
    }
  }

  switchView(showHistory) {
    // only allow toggle if user is TermsAccepted ???
    this.setState({
      showHistory,
    });
  }
  changeIndex(index) {
    debug(this, 'SWAPPED to index ', index); // eslint-disable-line no-console
    this.setState({
      vehicleIndex: index,
    });
  }
  dispatchAction(action) {
    const vec = this.getCurrentVehicle();
    // const vid = this.props.history.data[index].vehicleId;
    this.props.dispatch(action(vec.vehicleId));
  }

  generateCode() {
    this.dispatchAction(generateShareCode);
  }
  unshareCode() {
    this.dispatchAction(unshare);
  }
  registerCurrentVehicle() {
    this.dispatchAction(registerVehicle);
  }
  removeCurrentVehicle() {
    this.dispatchAction(removeVehicle);
  }
  getLatestIndex() {
    const {
      history,
    } = this.props;
    let latest;
    let vehicleIndex = 0;
    history.data.forEach((x, index) => {
      if (!x.isMovedOn && x.history.length > 0 && x.history[0].fromDate) {
        const dt = new Date(x.history[0].fromDate);
        if (!latest || dt > latest) {
          latest = dt;
          vehicleIndex = index;
        }
      }
    });
    return vehicleIndex;
  }
  getCurrentVehicle() {
    const {
      history,
    } = this.props;

    if (!history || !history.data || history.data.length === 0) {
      return null;
    }

    if (typeof this.state.vehicleIndex !== 'undefined' && this.props.isLoggedIn) {
      const data = history.data[this.state.vehicleIndex];
      data.vehicleIndex = this.state.vehicleIndex;
      return data;
    }

    const vehicleIndex = this.getLatestIndex();
    const data = history.data[vehicleIndex];
    data.vehicleIndex = vehicleIndex;
    return data;
  }

  log(text) {
    this.toastRef.close();
    console.log(text); // eslint-disable-line no-console
  }

  render() {
    const {
      // data,
      history,
      user,
      error,
      isError,
      isException,
      isLoggedIn,
      dispatch,
      shareCode,
    } = this.props;

    let contents;

    if (!hasToken()) {
      return <Redirect to="/code" push />;
    }

    if (isException) {
      debug(this, 'DASH EXCEPTION DETECTED - REDIRECT TO ERROR');
      // console.warn('DASH EXCEPTION DETECTED - REDIRECT TO ERROR'); // eslint-disable-line no-console
      return <Redirect to="/error" push />;
    }

    if (isError) {
      if (error.staus === UNAUTHORIZED || error.status === FORBIDDEN) {
        debug(this, 'DASH NOT ALLOWED TO SEE DASHBOARD - REDIRECT TO CODE');
        // console.warn('DASH NOT ALLOWED TO SEE DASHBOARD - REDIRECT TO CODE'); // eslint-disable-line no-console
        return <Redirect to="/code" push />;
      } else if (error.status === NO_CONTENT) {
        // NO CONTENTS GETS SPECIAL TREATMEMNT
        // console.warn('DASH NO CONTENTS - SHOW A MESSAGE'); // eslint-disable-line no-console
        debug(this, 'DASH NO CONTENTS - SHOW A MESSAGE');
        contents = (
          <div className={styles.message}>
            <h1 className={styles.header}><FormattedMessage id="noresults" /></h1>
            <h2 className={styles.subheader}><FormattedMessage id="needtodriveover" /></h2>
          </div>
        );
      } else {
        debug(this, 'DASH ERROR DETECTED - REDIRECT TO ERROR for status ', error.status);
        // console.warn('DASH ERROR DETECTED - REDIRECT TO ERROR for status ', error.status); // eslint-disable-line no-console
        return <Redirect to="/error" push />;
      }
    }

    if (!history) {
      debug(this, 'NO HISTORY');
      // console.warn('NO HISTORY'); // eslint-disable-line no-console
    }

    if (!user) {
      debug(this, 'NO USER');
      // console.warn('NO USER'); // eslint-disable-line no-console
    } else if (!user.preferences) {
      debug(this, 'NO USER => PREFERENCES');
      // console.warn('NO USER => PREFERENCES'); // eslint-disable-line no-console
    }

    // should get this from history data
    let vehicleIndexes = [];
    if (history && history.data && history.data.length > 0) {
      vehicleIndexes = history.data.map(h => h.vehicleId);
    }

    let shared;
    let owned;
    let index;
    let vehicleRegistered;
    let vehicleMoved;
    const histData = this.getCurrentVehicle();
    if (histData) {
      if (histData.isMovedOn) {
        vehicleMoved = true;
        contents = (
          <div className={styles.message}>
            <h1 className={styles.header}><FormattedMessage id="movedOnTitle" /></h1>
            <h2 className={styles.subheader}><FormattedMessage id="movedOnText" /></h2>
          </div>
        );
      } else {
        index = histData.vehicleIndex;
        shared = histData.shared;
        owned = histData.owned;
        vehicleRegistered = histData.isRegistered;
        // toggling view now exists
        // const histData = history.data[this.state.vehicleIndex];
        if (user && user.preferences) {
          const units = {
            pressure: user.preferences.pressureUnits,
            depth: user.preferences.depthUnits,
          };
          contents = (
            <History data={histData} units={units} showHistory={this.state.showHistory} shareCode={shareCode} />
          );
          debug(this, 'CONTENTS', contents);
          // console.warn('CONTENTS ', contents); // eslint-disable-line no-console
        }
      }
    }

    // let toast;
    // if (true) {
    //   toast = (
    //     <Toast
    //       text="Hello"
    //       color={Colors.orange800}
    //       icon="warning"
    //       ref={el => { this.toastRef = el; }}
    //     >
    //       <div onClick={() => this.log('OK')}>OK</div>
    //       <div onClick={() => this.log('CANCEL')}>CANCEL</div>
    //     </Toast>
    //   );
    // }

    // may also need top check isLoggedIn !!!
    const enabled = /* this.props.isRegistered && */ this.props.termsAccepted && isLoggedIn;

    return (
      <div>
        <Toolbar
          enabled = {enabled}
          shared = {shared}
          owned ={owned}
          viewChanged={this.switchView}
          indexChanged={this.changeIndex}
          generateCode={this.generateCode}
          unshare={this.unshareCode}
          items={vehicleIndexes}
          index={index}
          registered={vehicleRegistered}
          registerVehicle={this.registerCurrentVehicle}
          removeVehicle={this.removeCurrentVehicle}
          isMoved={vehicleMoved}
        />
        {contents}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // ...state.dashboard,
    ...state.user,
    history: state.dashboard,
    shareCode: state.dashboard.shareCode,
    termsAccepted: areTermsAccepted(state),
    isRegistered: isRegistered(state),
    isError: isError(state),
    isException: isException(state),
    isLoggedIn: isLoggedIn(state),
    error: state.error,
  };
};

export default connect(mapStateToProps)(DashboardPage);
