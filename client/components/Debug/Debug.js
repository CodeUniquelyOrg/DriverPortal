/* index.js */
const debug = require('debug');

// wrap 'debug'
module.exports = function() {
  let namespace, ctx, msg, label;

  // If there is only one argument re-align them
  if (arguments.length === 1) {
    msg = arguments[0];
  } else if (arguments.length === 3) {
    ctx = arguments[0];
    msg = arguments[1];
    label = arguments[2];
  } else {
    ctx = arguments[0];
    msg = arguments[1];
  }

  // allow nulls and undefined to be debugged
  if (msg === null) {
    msg = 'null';
  } else if (typeof msg === 'undefined') {
    msg = 'undefined';
  }

  if (ctx && ctx.constructor && ctx.constructor.displayName) {
    namespace = ctx.constructor.displayName;
  } if (ctx && ctx.constructor && ctx.constructor.name) {
    namespace = ctx.constructor.name;
  } else if (ctx && typeof ctx.displayName === 'function') {
    namespace = ctx.displayName();
  } else if (ctx && ctx.displayName) {
    namespace = ctx.displayName;
  } else if (ctx && typeof ctx === 'Object') {
    namespace = `${ctx} class [object]`;
  } else if (ctx && typeof ctx === 'Array') {
    namespace = `${ctx} [Array]`;
  } else if (ctx) {
    namespace = ctx;
  } else {
    namespace = 'class';
  }

  // spit out the object as strings
  // if (typeof msg === 'object' || typeof msg === 'array') {
  //   console.log('\nMATCHED THE OBJECT\n')
  //   let json = JSON.stringify(msg);
  //   msg = json;
  // }

  // is there a label
  if (label) {
    msg = `(${label})\n  - ${msg}`;
  }

  debug(namespace)(msg);
};
