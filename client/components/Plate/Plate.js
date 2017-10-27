import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

class Plate extends Component {
  static propTypes = {
    registration: PropTypes.string.isRequired,
    isYellow: PropTypes.bool,
  };

  static defaultProps = {
    isYellow: false,
  };

  render() {
    const {
      registration,
      isYellow,
      ...rest
    } = this.props;
    const styleClass = isYellow ? style.yellow : style.white;
    return (
      <div className={styleClass}>
        {registration}
      </div>
    );
  }
}

export default Plate;
