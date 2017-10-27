import { removeToken, getToken, setToken } from 'services/tokens';

// mocking LocalStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = value;
  }
  removeItem(key) {
    delete this.store[key]; // eslint-disable-line
  }
}

describe('Tokens', () => {
  //
  beforeEach(() => {
    global.localStorage = new LocalStorageMock();
  });

  test('remove Token', () => {
    localStorage.removeItem = jest.fn();

    removeToken('test');
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith('wr.token');
  });

  test('get Token', () => {
    localStorage.getItem = jest.fn();
    localStorage.getItem.mockImplementationOnce(token => { return 'token'; });

    const token = getToken();
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledWith('wr.token');
    expect(token).toEqual('token');
  });

  test('set Token', () => {
    localStorage.setItem = jest.fn();

    setToken('test');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem.mock.calls[0][0]).toEqual('wr.token');
    expect(localStorage.setItem.mock.calls[0][1]).toEqual('test');
  });

  test('What you put in is what you get out ', () => {
    setToken('test');
    const token = getToken();
    expect(token).toEqual('test');
  });

  //
});
