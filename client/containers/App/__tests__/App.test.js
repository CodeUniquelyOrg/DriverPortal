import React from 'react';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { intlShape } from 'react-intl';
import { intl } from 'services/react-intl-test-helper';

// Use local files for teesting
import { App } from '../App';
import styles from '../App.css';

const intlProp = { ...intl, enabledLanguages: ['en', 'de'] };
const children = <h1>Test</h1>;
const dispatch = sinon.spy();
const props = {
  children,
  dispatch,
  intl: intlProp,
};

test('renders properly', () => {
  const wrapper = shallow(
    <App {...props} />
  );
  // t.is(wrapper.find('Helmet').length, 1);
  expect(wrapper.find('Header').length).toBe(1);
  expect(wrapper.find('Footer').length).toBe(1);
  expect(wrapper.find('Header + div').hasClass(styles.container)).toBeTruthy();
  expect(wrapper.find('Header + div').children()).toBeTruthy();
});

test('calls componentDidMount', () => {
  sinon.spy(App.prototype, 'componentDidMount');
  mount(
    <App {...props} />,
    {
      context: {
        router: {
          history: {
            block: sinon.stub(),
            createHref: sinon.stub(),
            go: sinon.stub(),
            goBack: sinon.stub(),
            goForward: sinon.stub(),
            // length:
            listen: sinon.stub(),
            location: {
              // hash
              // pathname:
              // search:
              // state:
            },
            push: sinon.stub(),
            replace: sinon.stub(),
          },
          route: {
            location: {
              // hash
              // pathname:
              // search:
              // state:
            },
            match: {
              // isExact
              // params: {}
              // path:
              // url:
            },
          },
        },
        intl,
      },
      childContextTypes: {
        router: PropTypes.object,
        intl: intlShape,
      },
    },
  );

  expect(App.prototype.componentDidMount.calledOnce).toBeTruthy();
  App.prototype.componentDidMount.restore();
});
