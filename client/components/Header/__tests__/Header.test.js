import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { Header } from 'components/Header/Header';
import { intl } from 'services/react-intl-test-helper';

const intlProp = { ...intl, enabledLanguages: ['en', 'de'] };

test('renders the header properly', () => {
  const router = {
    isActive: sinon.stub().returns(true),
  };
  const wrapper = shallow(
    <Header switchLanguage={() => {}} intl={intlProp} toggleAddPost={() => {}} />,
    {
      context: {
        router,
        intl,
      },
    }
  );

  expect(
    wrapper.find('Link').first().containsMatchingElement(<FormattedMessage id="siteTitle" />)
  ).toBeTruthy();
  expect(wrapper.find('a').length).toBe(1);
});

test('doesn\'t add post in pages other than home', () => {
  const router = {
    isActive: sinon.stub().returns(false),
  };
  const wrapper = shallow(
    <Header switchLanguage={() => {}} intl={intlProp} toggleAddPost={() => {}} />,
    {
      context: {
        router,
        intl,
      },
    }
  );

  expect(wrapper.find('a').length).toBe(0);
});

test('toggleAddPost called properly', () => {
  const router = {
    isActive: sinon.stub().returns(true),
  };
  const toggleAddPost = sinon.spy();
  const wrapper = shallow(
    <Header switchLanguage={() => {}} intl={intlProp} toggleAddPost={toggleAddPost} />,
    {
      context: {
        router,
        intl,
      },
    }
  );

  wrapper.find('a').first().simulate('click');
  expect(toggleAddPost.calledOnce).toBeTruthy();
});
