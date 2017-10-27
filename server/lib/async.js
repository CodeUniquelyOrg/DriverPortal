import path from 'path';
import fs from 'fs';
import agent from 'superagent';

// server configuation
import serverConfig from 'server/config';
import { cleanUpResponse } from 'lib/utils';

// ASYNC - Dynamically load the JSON response from a file on disk
// const mockdata = require('../mock/history.json');
function loadMockData(url, callback) {
  const name = url.replace(/\/|:|\./g, '-');
  const file = path.resolve(`${serverConfig.mocks.path}/${name}.json`);
  const returnObj = {};
  try {
    // open the file as 'utf-8'
    fs.readFile(file, 'utf8', (err, contents) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('NOT FOUND MOCK FILE ', file); // eslint-disable-line no-console
          returnObj.status = 204;
        } else {
          console.log('LOAD MOCK ERROR ', err); // eslint-disable-line no-console
          returnObj.status = 500;
        }
        returnObj.error = err;
      } else {
        // Parse the JSON into an object, like c#
        returnObj.status = 200;
        returnObj.body = JSON.parse(contents);
      }
      // return
      return callback(null, returnObj);
    });
  } catch (e) {
    returnObj.status = 500;
    returnObj.error = e;
    console.log('LOAD MOCK CATCH ', e); // eslint-disable-line no-console
    callback(null, returnObj);
  }
}

function makePostRequest(url, data, callback) {
  const apiKey = serverConfig.auth.secret;
  console.log('\n\n'); // eslint-disable-line no-console
  console.log('makeRequest URL is ', url); // eslint-disable-line no-console
  console.log('makeRequest data   ', data); // eslint-disable-line no-console
  agent
    .post(url)
    .accept('application/json')
    .type('json')
    .send(data)
    // .ok(res => res.status < 500)
    .then(response => {
      callback(null, response);
    })
    .catch(e => {
      console.log('makePostRequest PROMISE ERROR ', e); // eslint-disable-line no-console
      callback(e);
    });
}

// ASYNC - SECURELY request the data from WebApi
function makeGetRequest(url, params, callback) {
  const apiKey = serverConfig.auth.secret;
  console.log('\n\n'); // eslint-disable-line no-console
  console.log('\nmakeRequest URL is ', url); // eslint-disable-line
  console.log('makeRequest Params ', params); // eslint-disable-line
  agent
    .get(url)
    .accept('application/json')
    .type('json')
    .query(params)
    .then(response => {
      console.log('makeGetRequest RESPONSE ', cleanUpResponse(response)); // eslint-disable-line no-console
      callback(null, response);
    })
    .catch(e => {
      console.log('SOME COMPLETELY ODD "SCREW-UP" DURING AN HTTP REQUEST'); // eslint-disable-line no-console
      console.log('makeGetRequest PROMISE ERROR ', e); // eslint-disable-line no-console
      callback(e);
    });
}

// All GET requests for data go via this function from now on
export function getRequest(path, params, callback) {
  const config = serverConfig.webapi;
  if (process.env.NODE_ENV === 'development') {
    if (config.offline) {
      loadMockData(path, callback);
    } else {
      const url = `${config.host}:${config.port}/${config.apiRoot}/${path}`;
      makeGetRequest(url, params, callback);
    }
  } else {
    const url = `${config.host}:${config.port}/${config.apiRoot}/${path}`;
    makeGetRequest(url, params, callback);
  }
}

// All POST requests of dtaa go via this function from now on
export function postRequest(path, data, callback) {
  const config = serverConfig.webapi;
  if (process.env.NODE_ENV === 'development') {
    if (config.offline) {
      loadMockData(path, callback);
    } else {
      const url = `${config.host}:${config.port}/${config.apiRoot}/${path}`;
      makePostRequest(url, data, callback);
    }
  } else {
    const url = `${config.host}:${config.port}/${config.apiRoot}/${path}`;
    makePostRequest(url, data, callback);
  }
}
