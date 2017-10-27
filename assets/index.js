// ========================================================
// Entry Script
// ========================================================
console.log('RUNNING WEBSITE'); // eslint-disable-line no-console
console.log(__dirname); // eslint-disable-line no-console
console.log(process.cwd()); // eslint-disable-line no-console

const fs = require('fs');
fs.readdir('.', (err, files) => {
  files.forEach(file => {
    console.log(file); // eslint-disable-line no-console
  });
});

process.env.webpackAssets = JSON.stringify(require('./manifest.json'));
process.env.webpackChunkAssets = JSON.stringify(require('./chunk-manifest.json'));
require('./server.bundle.js');
