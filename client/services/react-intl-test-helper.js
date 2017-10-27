/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */

import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';

// shallow => Enzyme
// Shallow rendering is useful to constrain yourself to testing a component as a unit,
// and to ensure that your tests aren't indirectly asserting on behavior of child components
// So only the component is loaded and any (NESTED / CONTAINED) content is not insantiaited.
import { mount, shallow } from 'enzyme';

// USE ENGLISH version of messages to test the IntlProvider.
const messages = require('i18n/localizationData/en');

// *** MOCK context of IntlProvider => retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
export const { intl } = intlProvider.getChildContext();

// Using React-Intl `injectIntl` on components, intl is required.
const nodeWithIntlProp = (node) => {
  return React.cloneElement(node, { intl });
};

// shallow => pass in a context with intl loaded
export const shallowWithIntl = (node) => {
  return shallow(nodeWithIntlProp(node), { context: { intl } });
};

// mount => (including child context) && pass in a context with intlShape loaded
export const mountWithIntl = (node) => {
  return mount(nodeWithIntlProp(node), {
    context: { intl },
    childContextTypes: { intl: intlShape },
  });
};
