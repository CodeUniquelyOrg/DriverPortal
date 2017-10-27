import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // -DOM needed for LINK

import styles from './styles.css';

class Icon extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    hidden: PropTypes.bool,
    link: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    tooltip: PropTypes.string,
    color: PropTypes.string,
    clickFn: PropTypes.func,
  };

  static defaultProps = {
    enabled: true,
    hidden: false,
  }

  constructor (props) {
    super(props);
    this.state = {
      show: false,
      hover: false,
    };

    this.clicked = this.clicked.bind(this);
    this.entered = this.entered.bind(this);
    this.exited = this.exited.bind(this);
  }

  clicked = () => {
    if (this.props.clickFn && this.props.enabled) {
      this.props.clickFn();
    }
  };

  entered = () => {
    if (typeof this.props.tooltip !== 'undefined') {
      this.setState({ show: true });
    }
    if (this.props.enabled) {
      this.setState({ hover: true });
    }
  };

  exited = () => {
    if (typeof this.props.tooltip !== 'undefined') {
      this.setState({ show: false });
    }
    if (this.props.enabled) {
      this.setState({ hover: false });
    }
  };

  render() {
    const {
      name,
      tooltip,
      enabled,
      hidden,
      link,
      color,
    } = this.props;

    // build a style for the font too...
    let toolTip;
    if (this.state.show) {
      toolTip = (
        <div className={styles.tooltip}>
          <span className={styles.content} >{tooltip}</span>
        </div>
      );
    }

    const wrapperStyle = `${styles.wrapper}${!enabled & hidden ? ' ' + styles.hidden : ''}`;

    const iconStyle = `material-icons ${ enabled ? this.state.hover ? styles.hover : styles.icon : styles.iconDisabled}`; // eslint-disable-line
    let iconColor;
    if (color) {
      iconColor = { color };
    }

    let content;
    if (typeof link !== 'undefined' && enabled) {
      content = (
        <Link to={link}>
          <span className={iconStyle} style={iconColor}>{name}</span>
        </Link>
      );
    } else {
      content = (
        <span className={iconStyle} style={iconColor}>{name}</span>
      );
    }

    return (
      <div className={wrapperStyle} onClick={this.clicked} onMouseEnter ={this.entered} onMouseLeave={this.exited}>
        {content}
        {toolTip}
      </div>
    );
  }
}

export default Icon;

