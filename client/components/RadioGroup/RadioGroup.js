import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadioGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    selectedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  renderChildren() {
    const {
      name,
      selectedValue,
      onChange,
      children,
    } = this.props;

    return React.Children.map(children, child => {
      if (child) {
        return React.cloneElement(child, { name, selectedValue, onChange });
      }
      return false;
    });
  }

  render() {
    const options = this.renderChildren();
    return (
      <div>
        {options}
      </div>
    );
  }
}

export default RadioGroup;
