import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

const allowedInput = '0123456789ABCDEFGHJKLMNPQRSTVWXYZ';
const convertLower = 'abcdefghjklmnpqrstvwxyz';

// entering of a code character
class Character extends Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    onBackspace: React.PropTypes.func.isRequired,
    secret: React.PropTypes.bool,
  };

  static defaultProps = {
    secret: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(e) {
    if (e.keyCode === 8 && (!this.state.value || !this.state.value.length)) {
      this.props.onBackspace();
    }
  }

  clear() {
    this.setState({
      value: ''
    });
  }

  onChange(e) {
    let value = e.target.value;
    if (convertLower.indexOf(value) !== -1) {
      value = value.toUpperCase();
    }
    if (allowedInput.indexOf(value) === -1) {
      value = '';
    }
    if (this.state.value === value) {
      return;
    }
    if (value.length < 2) {
      this.props.onChange(value);
      this.setState({ value });
    }
  }

  focus() {
    this.input.focus();
  }

  render() {
    const { value } = this.state;

    return (
      <input
        className = {style.inputText}
        ref = {n => (this.input = n)}
        type = {this.props.secret ? 'password' : 'text'}
        value = {value}
        onChange = {this.onChange}
        onKeyDown = {this.onKeyDown}
        onFocus = {e => e.target.select()}
        maxLength = '1'
        autoComplete = 'off'
      />
    );
  }
}

export default Character;
