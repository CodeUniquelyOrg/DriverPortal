import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // -DOM needed for LINK
import { injectIntl, FormattedMessage, FormattedNumber, FormattedDate, FormattedTime } from 'react-intl';

// Components
import Car from 'components/Car';
import Plate from 'components/Plate';
import Flags from 'components/Flags';

import styles from './style.css';

class History extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    showHistory: PropTypes.bool,
    units: PropTypes.object.isRequired,
    shareCode: PropTypes.object,
  }

  static defaultProp = {
    showHistory: false,
  }

  render() {
    const {
      data,
      showHistory,
      units,
      shareCode,
      ...rest,
    } = this.props;

    // list = data.map(item => {
    const vid = data.vehicleId;
    const history = data.history;

    const baseVehicle = {
      vehicleId: data.vehicleId,
      plate: data.plate,
      shared: data.shared,
      owned: data.owned,
      registered: data.isRegistered,
    };

    console.log('BASE VEC ', baseVehicle); // eslint-disable-line no-console

    let code;
    if (shareCode && shareCode.share) {
      code = (
        <div className={styles.shareCode}>
          <span className={styles.label}>
            <FormattedMessage id="shareCodeIs" />
          </span>
          <span className={styles.code}>
            {shareCode.share}
          </span>
        </div>
      );
      console.log('CODE ', code); // eslint-disable-line no-console
    }

    const historyList = history.map((h, j) => {
      const vehicle = Object.assign({}, baseVehicle, { location: h.location, fromDate: h.fromDate });

      if (!showHistory && j) {
        return;
      }
      return (
        <div key={j}>
          <Car tyres={h.tyres} vehicle={vehicle} units={units} />
        </div>
      );
    });

    return (
      <div className={styles.root}>
        <div className={styles.plate}>
          <Plate registration={data.plate} isYellow />
          <Flags registered={baseVehicle.registered} linked={baseVehicle.owned} shared={baseVehicle.shared}/>
          {code}
        </div>
        <ul>{historyList}</ul>
      </div>
    );
  }
}

export default injectIntl(History);
