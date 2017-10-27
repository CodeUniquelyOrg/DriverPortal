import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';

import style from './style.css';

class Logo extends Component {
  render() {
    const {
      className,
    } = this.props;

    const fillColor = '#212121';
    const tileColor = 'transparent';

    return (
      <div className={`${style.center} ${className}`}>
        <Avatar backgroundColor={tileColor} size={160} icon={<FontIcon className="material-icons">drive_eta</FontIcon>}/>
      </div>
    );
  }
}

export default Logo;
