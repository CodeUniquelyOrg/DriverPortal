import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from './styles.css';

class LanguageSwitcher extends Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    switchLanguage: PropTypes.func.isRequired,
  };

  render() {
    const {
      intl,
      switchLanguage,
    } = this.props;

    const languageNodes = intl.enabledLanguages.map(
      lang => <li key={lang} onClick={() => switchLanguage(lang)} className={lang === intl.locale ? styles.selected : ''}>{lang}</li>
    );

    return (
      <div className={styles['language-switcher']}>
        <ul>
          <li><FormattedMessage id="switchLanguage" /></li>
          {languageNodes}
        </ul>
      </div>
    );
  }
}

export default LanguageSwitcher;
