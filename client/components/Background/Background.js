import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

class Background extends Component {
  static propTypes = {
    isShown: PropTypes.bool,
  };
  static defaultProps = {
    isShown: true,
  };
  render() {
    const {
      isShown,
      ...rest
    } = this.props;

    const styleClass = isYellow ? style.yellow : style.white;

    return (
      <div className={style.container}>
        <div className={style.background}/>
        <div className={`${style.blurOverlay}`}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Background;
