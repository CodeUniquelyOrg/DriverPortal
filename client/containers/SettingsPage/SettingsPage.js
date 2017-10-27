import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// Imports
import MenuSetting from 'components/MenuSetting';

// UI Styling and other stuff like that
import styles from './styles.css';

class SettingsPage extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.form}>

          <h1 className={styles.heading}><FormattedMessage id="settings" /></h1>

          <div className={styles.boxes}>

            <MenuSetting iconName="account_circle" link="/settings/account" labelId="myAccount" tooltipId="myAccountTooltip" />
            <MenuSetting iconName="settings" link="/settings/preferences" labelId="preferences" tooltipId="preferencesTooltip" />
            <MenuSetting iconName="email" link="/settings/contact" labelId="contact" tooltipId="contactTooltip" />
            <MenuSetting iconName="face" link="/settings/personal" labelId="personal" tooltipId="personalTooltip" />
            { /* <MenuSetting iconName="drive_eta" link="/settings/vehicles" labelId="registrations" tooltipId="registrationsTooltip" /> */ }

            <div className={styles.formRowCentered}>
              <span className={styles.altButton}>
                <Link to="/" ><FormattedMessage id="dashboard" /></Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsPage;
