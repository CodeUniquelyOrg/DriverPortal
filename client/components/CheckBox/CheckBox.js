import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './style.css';

class CheckBox extends Component {
  static propTypes = {
    value: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.value,
    };
  }

  hasClicked = () => {
    const newState = !this.state.checked;
    if (this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState({
      checked: newState,
    });
  }

  render() {
    const {
      name,
      onChange,
      value,
      ...other,
    } = this.props;

    return (
      <div className={styles.root} onClick={this.hasClicked}>
        <input
          className={styles.input}
          type="checkbox"
          name={name}
          value={value}
          checked={this.state.checked}
          readOnly
        />
        <label className={styles.label}>{this.props.label}</label>
      </div>
    );
  }
}

export default CheckBox;
