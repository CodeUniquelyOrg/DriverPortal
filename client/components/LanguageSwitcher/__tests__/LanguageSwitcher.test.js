import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

// Imports
import { intl } from 'services/react-intl-test-helper';
import LanguageSwitcher from 'components/LanguageSwitcher';

const intlProp = { ...intl, enabledLanguages: ['en', 'de'] };

test('renders the switcher properly', () => {

  const wrapper = shallow(
    <LanguageSwitcher switchLanguage={() => {}} intl={intlProp} />,
  );

  expect(
    wrapper.find('li').first().containsMatchingElement(<FormattedMessage id="switchLanguage" />)
  ).toBeTruthy();

  expect(wrapper.find('li').length).toBe(2);
});
