import React from 'react';
import { FormattedMessage } from 'react-intl';

// Import the Shared background Image
// *** FIX ME - *** IMPORTS FOR ASSSETS
import bg from 'assets/img/header-bk.png';

// Import Style
import styles from './Footer.css';

export function Footer() {
  return (
    <div style={{ background: `#FFF url(${bg}) center` }} className={styles.footer}>
      <p>&copy; 2017 &middot; <a href="https://www.wheelright.de/" target="_Blank">Wheelright Ltd.</a></p>
    </div>
  );
}

export default Footer;
