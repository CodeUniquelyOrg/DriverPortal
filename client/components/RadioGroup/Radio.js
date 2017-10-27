import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class Radio extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string, // .isRequired,
    onChange: PropTypes.func, // .isRequired,
    selectedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
  };

  constructor(props) {
    super(props);
  }

  // hasChanged = () => {
  //   if (this.props.onChange) {
  //     console.log('CHNANGED'); // eslint-disable-line no-console
  //     this.props.onChange(this.props.value);
  //   }
  // }

  hasClicked = () => {
    if (this.props.onChange) {
      console.log('RADIO CHANGED'); // eslint-disable-line no-console
      this.props.onChange(this.props.value);
    }
  }

  render() {
    const {
      name,
      selectedValue,
      onChange,
      value,
      ...other,
    } = this.props;

    return (
      <div className={styles.root} onClick={this.hasClicked}>
        <input
          className={styles.input}
          type="radio"
          name={name}
          value={value}
          checked={value === selectedValue}
          readOnly
        />
        <label className={styles.label}>{this.props.label}</label>
      </div>
    );
  }
}

export default Radio;
