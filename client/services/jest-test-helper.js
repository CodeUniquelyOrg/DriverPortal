//
//  A Jest based 'Action' tester helper function
//
export const actionTest = (actionCreator) => {
  const params = [].slice.call(arguments, 1); // eslint-disable-line prefer-reflect
  const length = params.length;
  const hasDescription = typeof params[length - 1] === 'string';
  const offset = hasDescription ? 2 : 1;
  const expected = params[length - offset];
  const args = params.slice(0, length - offset);

  let description;
  if (hasDescription) {
    description = params[length - 1];
  }

  return (t) => {
    t.equals(actionCreator.apply(null, args), expected, description); // eslint-disable-line prefer-reflect, prefer-spread
  };
};
