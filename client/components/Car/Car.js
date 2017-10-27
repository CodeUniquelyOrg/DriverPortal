import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber, FormattedDate, FormattedTime } from 'react-intl';

import { average } from 'services/utils';

import Plate from 'components/Plate';
// import Tyre from 'components/Tyre';

import style from './style.css';

// ideal pressures will be held in DB as kPa
const getIdealPressure = (idealPressures, id, average) => {
  let ideal;
  if (idealPressures.length) {
    idealPressures.forEach(i => {
      if (i.id === id) {
        ideal = i.pressure;
      }
    });
  }
  if (!ideal) {
    ideal = average;
  }
  return ideal;
};

// average of all tyre pressures - held in kPa
// const getAveragePressure = (data) => {
//   let sigma = 0;
//   if (data.length) {
//     data.forEach(d => {
//       sigma += d.pressure;
//     });
//   }
//   return (sigma && sigma / data.length) || 230; // about 32 PSI
// };

const convertPressureUnits = (pressure, units) => {
  if (units.pressure === 'psi') {
    return <FormattedNumber value={pressure * 0.145038}/>;
  } else if (units.pressure === 'bar') {
    return <FormattedNumber value={pressure * 0.01} minimumFractionDigits={2} maximumFractionDigits={2} />;
  }
  return <FormattedNumber value={pressure} />;
};

const convertDepthUnits = (depth, units) => {
  if (depth <= 0) {
    return null;
  }
  if (units.depth === '32th') {
    return <FormattedNumber value={depth * 1.259842519685037}/>;
  }
  return <FormattedNumber value={depth} minimumFractionDigits={1} maximumFractionDigits={1} />;
};

const renderPrefix = (depth, good) => {
  if (depth <= 0) {
    return null;
  }
  return good ? null : <span className={style.deviation}>&gt;</span>;
};

class Car extends Component {
  static propTypes = {

    // A 'vehicle' registration record
    vehicle: PropTypes.shape({
      plate: PropTypes.string.isRequired,
      fromDate: PropTypes.string.isRequired,
      ideal: PropTypes.shape({
        depth: PropTypes.number.isRequired,
        pressures: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            pressure: PropTypes.number.isRequired,
          }),
        ),
      }),
    }),

    // The tyre data we pass in has this shape
    tyres: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        pressure: PropTypes.number.isRequired,
        depth: PropTypes.number.isRequired,
        good: PropTypes.bool.isRequired,
      }),
    ).isRequired,

    // May be in users prefereneces - optional
    units: PropTypes.shape({
      pressure: PropTypes.string.isRequired,
      depth: PropTypes.string.isRequired,
    }),

    // what percentage is allowed on pressure
    // tolerence: PropTypes.number,
  }

  getAxelFromTyreId = (id) => {
    if (id) {
      return Math.floor(id / 10);
    }
    return null;
  }

  renderTyre = (t, depth) => {
    return (
      <div key={t.id} className={style.tyre}>
        <div className={style.pressure}>
          {convertPressureUnits(t.pressure, this.props.units)}
        </div>
        <div className={style.depth}>
          {renderPrefix(t.depth, t.good)}
          {convertDepthUnits(t.depth, this.props.units)}
        </div>
      </div>
    );
  }

  renderAxel = (processingAxel, tyres, depth) => {
    const wheels = [];
    tyres.forEach(t => {
      const axel = this.getAxelFromTyreId(t.id);
      if (axel === processingAxel) {
        wheels.push(this.renderTyre(t, depth));
      }
    });

    let axleLab = 'Axle ' + processingAxel;
    if (tyres[tyres.length - 1].id < 30) {
      if (processingAxel === 2) {
        axleLab = <FormattedMessage id="rear" />;
      } else {
        axleLab = <FormattedMessage id="front" />;
      }
    }
    let lwheels = wheels.length > 2 ? wheels.splice(2, 2) : wheels.splice(1, 1);
    return (
      <div key={processingAxel}>
        <div className={style.axlelabel}>{axleLab}</div>
        <div className={style.axel}>
          <div className={style.measureaxle}>
            <div className={style.measure}>
              <FormattedMessage id={this.props.units.pressure} />
            </div>
            <div className={style.measure}>
              <FormattedMessage id={this.props.units.depth} />
            </div>
          </div>
          <div className={style.halfaxle}>{lwheels}</div>
          <div className={style.halfaxle}>{wheels}</div>
        </div>
      </div>
    );
  }

  // *Your latest drive over*  - DD-MM-yyyy: hh:mm
  //
  //        Right             Left
  //   --------------     --------------
  //      bar     mm   |    mm    bar
  //   --------------     --------------
  //   Pressure Tread  |  Tread Pressure
  //   Pressure Tread  |  Tread Pressure
  //
  getAllAxels() {
    const {
      vehicle,
      tyres,
      units,
      // tolerence,
    } = this.props;

    const axels = [];

    let processingAxel;
    console.log('this vehicle min tread DEPTH ',  vehicle.minTread); // eslint-disable-line

    // what is the average pressure of all tyres
    const averagePressure = average(tyres) || 320;

    tyres.forEach(t => {
      const axel = this.getAxelFromTyreId(t.id);
      if (axel !== processingAxel) {
        axels.push(this.renderAxel(axel, tyres, vehicle.minTread));
        processingAxel = axel;
      }
    });

    return (
      <div className={style.axels}>
        {axels}
      </div>
    );
  }

  render() {
    const {
      vehicle,
      tyres,
      ...rest,
    } = this.props;

    const allAxles = this.getAllAxels();

    return (
      <div className={style.root}>
        <div className={style.infoline}>
          <div className={style.subheader}>
            <FormattedDate className={style.date} value={new Date(vehicle.fromDate)} />
            <FormattedTime className={style.time} value={new Date(vehicle.fromDate)} />
            <span className={style.at}>@</span>
            <span className={style.location}>{vehicle.location}</span>
          </div>
        </div>
        <div className={style.table}>
          <div className={style.side}>
            <div />
            <div><FormattedMessage id="left" /></div>
            <div><FormattedMessage id="right" /></div>
          </div>
          {allAxles}
        </div>
      </div>
    );
    return null;
  }
}

export default Car;
