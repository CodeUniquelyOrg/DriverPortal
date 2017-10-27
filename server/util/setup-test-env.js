// To get normal classnames instead of CSS Modules classnames for testing
require('mock-css-modules');

// Ignore assets
require.extensions['.jpg'] = noop => noop;
require.extensions['.jpeg'] = noop => noop;
require.extensions['.png'] = noop => noop;
require.extensions['.gif'] = noop => noop;

require('babel-register');
require('babel-polyfill');

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');

const { window } = jsdom;

// function copyProps(src, target) {
//   const props = Object.getOwnPropertyNames(src)
//     .filter(prop => typeof target[prop] === 'undefined')
//     .map(prop => Object.getOwnPropertyDescriptor(src, prop));
//   Object.defineProperties(target, props);
// }
function copyProps(src, target) {
  const props = Reflect.ownKeys(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Reflect.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

copyProps(window, global);

// global.document = jsdom; //  require('jsdom').jsdom('<body></body>');
// global.window = document.defaultView;
// global.navigator = window.navigator;
