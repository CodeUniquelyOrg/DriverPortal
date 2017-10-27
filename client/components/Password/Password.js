import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { passwordEntropy } from 'services/entropy';
import styles from './style.css';

class Password extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onKeyDown: PropTypes.func,
  };

  static defaultProps = {
    enabled: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
    this.getContents = this.getContents.bind(this);
  }

  onChange = value => {
    this.setState({
      password: value,
    });
  };

  onKeyDown = e => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  getContents = () => this.state.password;

  get value() {
    return this.state.password;
  }

  getBar(entropy) {
    let color;
    if (entropy === 0 && this.state.password.length === 0) {
      color = 'transparent';
    } else if (entropy < 28) {
      color = '#F44336'; // red
    } else if (entropy < 35) {
      color = '#FF9800'; // orange
    } else if (entropy < 59) {
      color = '#FFEB3B'; //  yellow / orange
    } else if (entropy < 127) {
      color = '#8BC34A'; // light-green
    } else {
      color = '#4CAF50'; // darker-green
    }

    return (
      <div className={styles.bar} style={{ background: color }} />
    );
  }

  // number of bits on entropy
  // ==========================================================================================
  // < 28 bits       = Very Weak; might keep out family members
  //   28 - 35 bits  = Below Average; should keep out most people, often OK for login passwords
  //   36 - 59 bits  = Reasonable; fairly secure passwords for network and company passwords
  //   60 - 127 bits = Strong; can be good for guarding financial information
  //   128+ bits     = Very Strong; often overkill
  // ==========================================================================================

  render() {
    const {
      enabled,
      placeholder,
    } = this.props;

    const entropy = passwordEntropy(this.state.password);
    const bar = this.getBar(entropy);

    return (
      <div className={styles.root}>
        <div className={styles.combine} >
          <input
            type="password"
            placeholder={placeholder}
            className={styles.input}
            onChange={e => this.onChange(e.target.value)}
            onKeyDown={this.onKeyDown}
          />
          {bar}
        </div>
      </div>
    );
  }
}

export default Password;
