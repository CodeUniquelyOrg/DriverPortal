//
// Written my Steve Saxton <steves@codeuniquely.co.uk>
//
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Style
import styles from './styles.css';

export class PrevNext extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    index: PropTypes.number,
    items: PropTypes.array.isRequired,
    onUpdate: PropTypes.func.isRequired,
    tooltip: PropTypes.string,
  }

  static defaultProps = {
    enabled: false,
    index: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      hover: false,
      index: props.index,
    };
    this.decrease = this.decrease.bind(this);
    this.increase = this.increase.bind(this);
    this.entered = this.entered.bind(this);
    this.exited = this.exited.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.index) {
      this.setState({
        index: nextProps.index,
      });
    }
  }

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

  update = (index) => {
    this.setState({
      index,
    });
    if (this.props.onUpdate) {
      this.props.onUpdate(index);
    }
  };
  decrease = () => {
    if (!this.props.enabled) {
      return;
    }
    if (this.state.index > 0) {
      this.update(this.state.index - 1);
    }
  };
  increase = () => {
    if (!this.props.enabled) {
      return;
    }
    const maximum = this.props.items.length - 1;
    if (this.state.index < maximum) {
      this.update(this.state.index + 1);
    }
  };

  render() {
    const {
      enabled,
      items,
      tooltip,
    } = this.props;

    const index = this.state.index;
    const on1 = enabled && index > 0;
    const on2 = enabled && index < (items.length - 1);
    const style1 = `material-icons ${styles.icon} ${ on1 ? styles.on : styles.off}`;
    const style2 = `material-icons ${styles.icon} ${ on2 ? styles.on : styles.off}`;

    // build a style for the font too...
    let toolTip;
    if (this.state.show) {
      toolTip = (
        <div className={styles.tooltip}>
          <span className={styles.content} >{tooltip}</span>
        </div>
      );
    }

    return (
      <div className={styles.prevnext} onMouseEnter={this.entered} onMouseLeave={this.exited}>
        <div className={styles.switches}>
          <span className={style1} onClick={this.decrease}>chevron_left</span>
          <span className={style2} onClick={this.increase}>chevron_right</span>
        </div>
        {toolTip}
      </div>
    );
  }
}

export default PrevNext;
