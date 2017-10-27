import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // -DOM needed for LINK
import { FormattedMessage, injectIntl } from 'react-intl';

import Icon from 'components/Icon';

import styles from './style.css';

class MenuSetting extends Component {
  static propTypes = {
    iconName: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    link: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    labelId: PropTypes.string.isRequired,
    tooltipId: PropTypes.string,
    color: PropTypes.string,
  };

  static defaultProps = {
    enabled: true,
  }

  render() {
    const {
      iconName,
      tooltipId,
      enabled,
      link,
      color,
      labelId,
      intl,
    } = this.props;

    const tooltip = intl.messages[tooltipId];

    return (
      <div className={styles.root}>
        <Link to={link} >
          <div className={styles.menuItem}>
            <Icon name={iconName} tooltip={tooltip}/>
            <div className={styles.label}>
              <FormattedMessage id={labelId} />
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default injectIntl(MenuSetting);
