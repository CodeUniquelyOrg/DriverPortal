import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class Intl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.intl.messages,
    };
    this.messages = this.messages.bind(this);
  }

  get messages() {
    return this.state.messages;
  }

  render() {
    return null;
  }
}

export default injectIntl(Intl);
