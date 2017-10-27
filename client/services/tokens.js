//
// reading and writing tokens on the client device
//
import { checkIfMobile } from 'services/utils';

const tokenName = 'wr.token';
const loggedName = 'wr_';

const storage = () => {
  return checkIfMobile() ? localStorage : sessionStorage;
};

export const removeToken = () => {
  // localStorage.removeItem(tokenName);
  storage().removeItem(tokenName);
};

export const getToken = () => {
  // return localStorage.getItem(tokenName);
  return storage().getItem(tokenName);
};

export const setToken = (token) => {
  // localStorage.setItem(tokenName, token);
  storage().setItem(tokenName, token);
};

export const hasToken = () => {
  return storage().getItem(tokenName) !== null;
};

export const logOut = () => {
  sessionStorage.removeItem(loggedName);
};

export const logIn = () => {
  sessionStorage.setItem(loggedName, 1);
};

export const hasLogin = () => {
  return sessionStorage.getItem(loggedName) !== null;
};
