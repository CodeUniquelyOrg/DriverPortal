import React from 'react';
import { shallow } from 'enzyme';

import Plate from 'components/Plate';

//
// Plate.js tests
//
describe('Plate', () => {
  //
  test('should render correctly', () => {
    const registration = {
    };
    const component = shallow(<Plate registration="XX00 XXX" />);
    expect(component).toMatchSnapshot();
  });

  //
});
