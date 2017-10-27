import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';

export function IntlWrapper(props) {
  return (
    <IntlProvider {...props.intl} >
      {props.children}
    </IntlProvider>
  );
}

IntlWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  // intl: intlShape.isRequired
  intl: PropTypes.shape({
    locale: PropTypes.string.isRequired,
    enabledLanguages: PropTypes.arrayOf(PropTypes.string),
    messages: PropTypes.object.isRequired,
  }).isRequired,
};

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    intl: state.intl,
  };
};

export default connect(mapStateToProps)(IntlWrapper);
