import React, { Component } from 'react';
import PropTypes from 'prop-types';

// component imports
import { injectIntl } from 'react-intl';
import Icon from 'components/Icon';
import { Colors } from 'components/Colors';

// style imports
import styles from './styles.css';

class Flags extends Component {
  static propTypes = {
    shared: PropTypes.bool,
    registered: PropTypes.bool,
    linked: PropTypes.bool,
  };

  render() {
    const {
      shared,
      registered,
      linked,
    } = this.props;

    // build a style for the font too...
    let sharedFlag;
    if (shared) {
      sharedFlag = <Icon name="share" tooltip={this.props.intl.messages.vehicleIsSharedTooltip} color={Colors.red500} enabled={false} />;
    }

    let linkedFlag;
    if (linked) {
      linkedFlag = <Icon name="link" tooltip={this.props.intl.messages.vehicleOwnedByOtherTooltip} color={Colors.amber500} enabled={false} />;
    }

    let registeredFlag;
    if (registered) {
      registeredFlag = <Icon name="check" tooltip={this.props.intl.messages.vehicleRegisteredTooltip} color={Colors.green500} enabled={false} />;
    }

    return (
      <div className={styles.root} >
        {registeredFlag}
        {sharedFlag}
        {linkedFlag}
      </div>
    );
  }
}

export default injectIntl(Flags);
