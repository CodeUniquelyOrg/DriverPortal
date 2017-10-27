//
//
// Written my Steve Saxton <steves@codeuniquely.co.uk>
//
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // -DOM needed for LINK
import { injectIntl, FormattedMessage } from 'react-intl';

// imports
import Toggle from 'components/Toggle';
import PrevNext from 'components/PrevNext';
import Icon from 'components/Icon';

// Import Style
import styles from './styles.css';

export class Toolbar extends Component {
  static propTypes = {
    enabled: PropTypes.bool,
    shared: PropTypes.bool,
    owned: PropTypes.bool,
    index: PropTypes.number,
    registered: PropTypes.bool,
    isMoved: PropTypes.bool,
    indexChanged: PropTypes.func.isRequired,
    generateCode: PropTypes.func.isRequired,
    unshare: PropTypes.func.isRequired,
    items: PropTypes.array,
    viewChanged: PropTypes.func.isRequired,
    registerVehicle: PropTypes.func.isRequired,
    removeVehicle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    index: 0,
    items: [],
    enabled: false,
    shared: false,
    registered: false,
    isMoved: false,
  }

  unshare = (action) => {
    // do something here
    this.props.unshare();
  };

  switchDataView = (showHistory) => {
    this.props.viewChanged(showHistory);
  };

  onPrevNext = (index) => {
    this.props.indexChanged(index);
  };

  generateCode = () => {
    this.props.generateCode();
  };

  registerVehicle =() => {
    this.props.registerVehicle();
  };

  removeVehicle = () => {
    this.props.removeVehicle();
  };

  renderAdd(enabled) {
    return <Icon name="add_circle" enabled link={{ pathname: '/code', isSharingCode: false }} tooltip={this.props.intl.messages.enterCodeTooltip} />;
  }

  renderLink(enabled) {
    return <Icon name="link" enabled={enabled} link={{ pathname: '/code', isSharingCode: true }} tooltip={this.props.intl.messages.enterShareCodeTooltip} hidden />;
  }

  renderShare(wasEnabled, ownedByOther, registered) {
    const enabled = wasEnabled && registered && ownedByOther === false;
    return <Icon name="share" enabled={enabled} clickFn={this.generateCode} tooltip={this.props.intl.messages.shareVehicleTooltip} hidden />;
  }

  renderUnshare(wasEnabled, ownedByOther, shared) {
    const enabled = wasEnabled && (ownedByOther === true || shared);
    return <Icon name="cancel" enabled={enabled} clickFn={this.unshare} tooltip={this.props.intl.messages.stopSharingTooltip} hidden />;
  }

  renderRegisterVehicle(wasEnabled, ownedByOther, registered) {
    const enabled = wasEnabled && ownedByOther === false && registered === false;
    return <Icon name="drive_eta" enabled={enabled} clickFn={this.registerVehicle} tooltip={this.props.intl.messages.registerVehicleTooltip} hidden />;
  }

  renderRemoveVehicle(wasEnabled, ownedByOther, isMoved) {
    const enabled = (wasEnabled && ownedByOther === false) || isMoved;
    return <Icon name="delete" enabled={enabled} clickFn={this.removeVehicle} tooltip={this.props.intl.messages.removeVehicleTooltip} hidden />;
  }

  renderSettings(enabled) {
    return <Icon name="settings" enabled={enabled} link="/settings" tooltip={this.props.intl.messages.yourSettingsTooltip} hidden />;
  }

  render() {
    const {
      enabled,
      shared,
      owned,
      index,
      items,
      registered,
      isMoved,
    } = this.props;

    // Build the buttons on the toolbar
    const addLink = this.renderAdd(enabled);
    const linkLink = this.renderLink(enabled);
    const shareLink = this.renderShare(enabled, owned, registered);
    const unshareLink = this.renderUnshare(enabled, owned, shared);
    const settingsLink = this.renderSettings(enabled);
    const registerLink = this.renderRegisterVehicle(enabled, owned, registered);
    const removeLink = this.renderRemoveVehicle(enabled, owned, isMoved);

    return (
      <div className={styles.root}>

        <PrevNext enabled={enabled} onUpdate={this.onPrevNext} items={this.props.items} index={this.props.index} tooltip={this.props.intl.messages.prevNextTooltip} />
        <Toggle enabled={enabled} onToggle={this.switchDataView} iconOff="drive_eta" iconOn="history" tooltip={this.props.intl.messages.toggleHistoryTooltip} />

        <span className={styles.divider} />

        {addLink}
        {linkLink}
        {shareLink}
        {unshareLink}

        <span className={styles.divider} hidden />

        {registerLink}
        {removeLink}

        <span className={styles.divider} hidden />

        {settingsLink}

      </div>
    );
  }
}

export default injectIntl(Toolbar);
