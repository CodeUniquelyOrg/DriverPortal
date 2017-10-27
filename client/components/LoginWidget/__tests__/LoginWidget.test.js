import React from 'react';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { PostCreateWidget } from 'components/PostCreateWidget/PostCreateWidget';
import { mountWithIntl, shallowWithIntl } from 'services/react-intl-test-helper';

const props = {
  addPost: () => {},
  showAddPost: true,
};

test('renders properly', () => {
  const wrapper = shallowWithIntl(
    <PostCreateWidget {...props} />
  );

  expect(wrapper.hasClass('form')).toBeTruthy();
  // expect(wrapper.hasClass('appear')).toBeTruthy();
  expect(
    wrapper.find('h2').first().containsMatchingElement(<FormattedMessage id="login" />)
  ).toBeTruthy();
  expect(wrapper.find('input').length).toBe(2);
  // expect(wrapper.find('textarea').length).toBe(1);
});

// test('hide when showAddPost is false', () => {
//   const wrapper = mountWithIntl(
//     <PostCreateWidget {...props} />
//   );
//   wrapper.setProps({ showAddPost: false });
//   expect(wrapper.hasClass('appear')).toBeFalsy();
// });

test('has correct props', () => {
  // const wrapper = mountWithIntl(
  //   <PostCreateWidget {...props} />
  // );
  // expect(wrapper.prop('addPost')).toBe(props.addPost);
  // expect(wrapper.prop('showAddPost')).toBe(props.showAddPost);
});

test('calls login', () => {
  const login = sinon.spy();
  // const wrapper = mountWithIntl(
  //   <PostCreateWidget addPost={addPost} showAddPost />
  // );
  // ERROR !!!!
  wrapper.ref('email').get(0).value = 'test@test.com';
  wrapper.ref('password').get(0).value = 'password';

  wrapper.find('a').first().simulate('click');
  expect(login).toBeTruthy();
  expect(calledWith('test@test.com', 'password')).toBeTruthy();
});

test('empty form doesn\'t call addPost', () => {
  const login = sinon.spy();
  // const wrapper = mountWithIntl(
  //   <PostCreateWidget addPost={addPost} showAddPost />
  // );
  wrapper.find('a').first().simulate('click');
  expect(login).toBeFalsy();
});
