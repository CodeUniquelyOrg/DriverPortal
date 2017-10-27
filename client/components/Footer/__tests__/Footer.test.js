import React from 'react';
import { shallow } from 'enzyme';
import { Footer } from 'components/Footer/Footer';

test('renders the footer properly', () => {
  const wrapper = shallow(
    <Footer />
  );
  expect(wrapper.find('p').length).toBe(1);
  expect(wrapper.find('p').first().text()).toBe('© 2017 · Wheelright Ltd.');
});
