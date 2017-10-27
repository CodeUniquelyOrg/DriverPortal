import fetch from 'isomorphic-fetch';
import promises from 'es6-promise'; // .polyfill();

import { getToken, setToken, removeToken } from 'services/tokens';
import serverConfig from 'server/config';

// POLYFILL promises for IE11
promises.polyfill();

export const API_ROOT = '/api/v1';

export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test') ?
  process.env.BASE_URL || (`http://localhost:${process.env.PORT || serverConfig.port}${API_ROOT}`) : API_ROOT;

export default function callApi(endpoint, method = 'get', body) {
  const url = `${API_URL}/${endpoint}`;

  // default headers
  const headers = {
    'content-type': 'application/json'
  };

  // we need to insert token if we have it
  const token = getToken();
  if (typeof token !== 'undefined' && token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    // credentials: 'same-origin',
    headers,
    method,
    body: JSON.stringify(body),
  })
    .then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      // set the toke if it exists
      if (json && json.token) {
        setToken(json.token);
      }
      return json;
    })
    .then(
      response => response,
      error => error
    );
}
