//
// Written my Steve Saxton <steves@codeuniquely.co.uk>
//
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Style
import styles from './styles.css';

export class Toggle extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    iconOn: PropTypes.string,
    iconOff: PropTypes.string,
    tooltip: PropTypes.string,
    onToggle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    enabled: false,
    iconOn: '',
    iconOff: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      hover: false,
      toggled: props.toggled || false,
    };
    this.toggle = this.toggle.bind(this);
    this.entered = this.entered.bind(this);
    this.exited = this.exited.bind(this);
  }

  // toggle the state
  toggle = () => {
    if (!this.props.enabled) {
      return;
    }
    const newState = !this.state.toggled;
    this.setState( {
      toggled: newState,
    });
    if(this.props.onToggle) {
      this.props.onToggle(newState);
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
      enabled,
      iconOff,
      iconOn,
      tooltip,
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

    const on = enabled && this.state.toggled;
    const style1 = `material-icons ${styles.icon} ${ on ? styles.off : styles.on}`;
    const style2 = `material-icons ${styles.icon} ${ on ? styles.on : styles.off}`;

    return (
      <div className={styles.toggle} onMouseEnter={this.entered} onMouseLeave={this.exited}>
        <div className={styles.switches} onClick={this.toggle}>
          <span className={style1}>{iconOff}</span>
          <span className={style2}>{iconOn}</span>
        </div>
        {toolTip}
      </div>
    );
  }
}

export default Toggle;
