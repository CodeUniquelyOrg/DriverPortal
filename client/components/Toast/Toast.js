import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // -DOM needed for LINK

import { Colors, ColorUtils } from 'components/Colors';
import Icon from 'components/Icon';
import styles from './styles.css';

class Toast extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.string,
    color: PropTypes.string,
    timeout: PropTypes.number,
    immediate: PropTypes.bool,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    color: Colors.grey400,
    immediate: true,
  }

  constructor (props) {
    super(props);
    this.state = {
      shown: false,
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  componentDidMount() {
    if (this.props.immediate) {
      this.open();
    }
  }

  open = () => {
    this.setState({
      shown: true,
    });
    if (this.props.timeout) {
      setTimeout(() => {
        this.setState({
          shown: false,
        });
      }, this.props.timeout);
    }
  }

  close = () => {
    this.setState({
      shown: false,
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  rawMarkup = (html) => {
    return { __html: html };
  }

  renderChildren() {
    const {
      color,
      children,
    } = this.props;

    const background = ColorUtils.fadeSlightly(color);
    const textColor = ColorUtils.foreOnBackground(background);
    const buttons = Children.map(children, child => {
      if (child) {
        return React.cloneElement(child, { className: styles.button, style: { background, color: textColor } });
      }
      return false;
    });

    return (
      <div className={styles.buttonWrapper}>
        {buttons}
      </div>
    );
  }

  render() {
    const {
      text,
      icon,
      color,
      timeout,
      children,
    } = this.props;

    let iconContent;
    if (icon) {
      iconContent = (
        <Icon name={icon} color={Colors.white} enabled={false} />
      );
    }

    let buttonContent;
    if (children && !timeout) {
      buttonContent = this.renderChildren();
    }

    // build a style for the font too...
    let content = null;
    if (this.state.shown) {
      content = (
        <div className={styles.root} style={{ background: color }}>
          <div className={styles.toast} >
            {iconContent}
            <div className={styles.text} dangerouslySetInnerHTML={this.rawMarkup(text)} />
          </div>
          {buttonContent}
        </div>
      );
    }

    return content;
  }
}

export default Toast;

