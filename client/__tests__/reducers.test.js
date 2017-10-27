import combinedReducers from 'client/reducers';

describe('Client Reducers', () => {
  //
  test('there should be a defined state', () => {
    const state = combinedReducers();
    expect(state).toEqual([]);
    expect(state).toBeDefined();

    expect(state.app).toBeDefined();
    expect(state.intl).toBeDefined();
    expect(state.validate).toBeDefined();
    expect(state.dashboard).toBeDefined();
    expect(state.login).toBeDefined();
    expect(state.user).toBeDefined();
  });
  //
});

