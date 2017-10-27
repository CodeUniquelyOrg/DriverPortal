import React from 'react';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { registerWidget } from 'components/registerWidget';
import { mountWithIntl, shallowWithIntl } from 'services/react-intl-test-helper';

const props = {
  register: () => {},
  // intl: intlShape.isRequired,
};

test('renders properly', () => {
  const wrapper = shallowWithIntl(
    <registerWidget {...props} />
  );

  expect(wrapper.hasClass('form')).toBeTruthy();
  expect(
    wrapper.find('h2').first().containsMatchingElement(<FormattedMessage id="register" />)
  ).toBeTruthy();
  expect(wrapper.find('input').length).toBe(4);
});

test('has correct props', () => {
  const wrapper = mountWithIntl(
    <registerWidget {...props} />
  );
  expect(wrapper.prop('register')).toBe(props.register);
});

test('empty form doesn\'t allow submit', () => {
  const register = sinon.spy();
  const wrapper = mountWithIntl(
    <registerWidget {...props} />
  );

  wrapper.find('a').first().simulate('click');
  expect(register.called).toBeFalsy();
});
