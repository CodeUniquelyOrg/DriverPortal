import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import debug from 'components/Debug';
// import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Radio, RadioGroup } from 'components/RadioGroup';
import Toast from 'components/Toast';
import { Colors } from 'components/Colors';

// Import Style
import styles from './style.css';

export class PreferencesWidget extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
    pressure: PropTypes.string.isRequired,
    depth: PropTypes.string.isRequired,
    // intl: intlShape.isRequired,
    switchLanguage: PropTypes.func,
    language: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      pressure: props.pressure,
      depth: props.depth,
      language: props.language,
    };

    this.handleLanguage = this.handleLanguage.bind(this);

    this.savedToast = (
      <Toast
        text={this.props.messages.hasSaved}
        color={Colors.green500}
        icon="check"
        timeout={3000}
        immediate={false}
        ref={el => { this.toastRef = el; }}
      />
      // <Toast
      //   text={this.props.intl.messages.hasSaved}
      //   color={Colors.green500}
      //   icon="check"
      //   timeout={3000}
      //   immediate={false}
      //   ref={el => { this.toastRef = el; }}
      // />
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pressure) {
      this.setState({
        pressure: nextProps.pressure,
      });
    }
    if (nextProps.depth) {
      this.setState({
        depth: nextProps.depth,
      });
    }
    if (nextProps.language) {
      this.setState({
        language: nextProps.language,
      });
    }
  }

  // "language": "de-DE",
  // "pressureUnits": "bar",
  // "depthUnits": "mm",
  // "showUnits": true,
  // "contactBySMS": true,
  // "contactByEmail": true,
  // "contactInApp": false
  onSave = () => {
    debug(this, 'DATA TO BE SENT IS');
    debug(this, this.state);
    if (this.props.update) {
      this.props.update(this.state);
      this.toastRef.open();
    }
  };

  handlePressure = value => {
    debug(this, 'PRESSURE CHANGED');
    this.setState({
      pressure: value
    });
  };

  handleDepth = value => {
    debug(this, 'DEPTH CHANGED');
    this.setState({
      depth: value
    });
  };

  handleLanguage = value => {
    debug(this, 'LANG CHANGED');
    // this.props.switchLanguage(value);
    debug(this, 'Changed language to ', value);
    this.setState({
      language: value
    });
  };

  render() {
    const {
      messages,
    } = this.props;

    return (
      <div className={styles.form}>
        {this.savedToast}
        <div className={styles.formContent}>
          <h2 className={styles.formTitle}>{messages.preferences}</h2>

          <div className={styles.formRow}>
            <h3 className={styles.formSubTitle}>{messages.switchLanguage}</h3>
            <RadioGroup name="language" selectedValue={this.state.language} onChange={this.handleLanguage}>
              <Radio value="de" label="Deutsche"/>
              <Radio value="en" label="English"/>
            </RadioGroup>
          </div>

          <div className={styles.formRow}>
            <h3 className={styles.formSubTitle}>{messages.pressure}</h3>
            <RadioGroup name="pressure" selectedValue={this.state.pressure} onChange={this.handlePressure}>
              <Radio value="none" label={messages.none}/>
              <Radio value="kpa" label="kPa"/>
              <Radio value="bar" label="bar"/>
              <Radio value="psi" label="PSI"/>
            </RadioGroup>
          </div>

          <div className={styles.formRow}>
            <h3 className={styles.formSubTitle}>{messages.depth}</h3>
            <RadioGroup name="depth" selectedValue={this.state.depth} onChange={this.handleDepth}>
              <Radio value="none" label={messages.none}/>
              <Radio value="mm" label="mm"/>
              <Radio value="32th" label="1/32"/>
            </RadioGroup>
          </div>

          <div className={styles.formRowCentered}>
            <span className={styles.altButton}>
              <Link to="/settings" >{messages.back}</Link>
            </span>
            <button className={styles.submitButton} onClick={this.onSave}>{messages.update}</button>
          </div>
        </div>
      </div>
    );
  }
}

// Only map the intl stuff on this page
const mapStateToProps = (state) => {
  return {
    messages: state.intl.messages,
  };
};

export default connect(mapStateToProps)(PreferencesWidget);
// export default injectIntl(PreferencesWidget);
