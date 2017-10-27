import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
// import { refresh } from 'actions/AppActions';

// Import Style
import styles from './style.css';

export class PersonalWidget extends Component {
  static propTypes = {
    personal: PropTypes.object.isRequired,
    // refresh: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props.personal,
    };
  }

  onSave = () => {
    if (this.props.update) {
      this.props.update(this.state);
      // this.props.refresh();
    }
  };

  onChangeGreeting = value => {
    this.setState({
      greeting: value
    });
  };

  onChangePronoun = value => {
    this.setState({
      pronoun: value
    });
  };

  onChangeForename = value => {
    this.setState({
      foreName: value
    });
  };

  onChangeSurname = value => {
    this.setState({
      lastName: value
    });
  };

  render() {
    return (
      <div className={styles.form}>
        <div className={styles.formContent}>
          <h2 className={styles.formTitle}><FormattedMessage id="personal" /></h2>

          <div className={styles.formRow}>
            <input
              value={this.state.greeting}
              placeholder={this.props.intl.messages.greeting}
              className={styles.formField}
              onChange={e => this.onChangeGreeting(e.target.value)}
              ref="greeting"
            />
          </div>
          <div className={styles.formRow}>
            <input
              value={this.state.pronoun}
              placeholder={this.props.intl.messages.pronoun}
              className={styles.formField}
              onChange={e => this.onChangePronoun(e.target.value)}
              ref="pronoun"
            />
          </div>
          <div className={styles.formRow}>
            <input
              value={this.state.foreName}
              placeholder={this.props.intl.messages.forename}
              className={styles.formField}
              onChange={e => this.onChangeForename(e.target.value)}
              ref="foreName"
            />
          </div>
          <div className={styles.formRow}>
            <input
              value={this.state.lastName}
              placeholder={this.props.intl.messages.surname}
              className={styles.formField}
              onChange={e => this.onChangeSurname(e.target.value)}
              ref="lastName"
            />
          </div>
          <div className={styles.formRowCentered}>
            <span className={styles.altButton}>
              <Link to="/settings" ><FormattedMessage id="back" /></Link>
            </span>
            <button className={styles.submitButton} onClick={this.onSave}><FormattedMessage id="update" /></button>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(PersonalWidget);
