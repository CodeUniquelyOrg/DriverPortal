const config = {

  options: {
    // storageToUse: 'session',  // 'session' or 'local'
    storageToUse: 'local', // 'session' or 'local'
    depth: 'mm',
    pressure: 'bar',
    language: 'de',
    minTread: 6,
  },

  webapi: {
    offline: false,
    host: process.env.WEBAPI_HOST || '192.168.16.86', //  'localhost',
    port: process.env.WEBAPI_PORT || 58378,
    apiRoot: 'api',
  },

  auth: {
    secret: '6Fakv2Crlg85Vm7y4!!524782C66+5|8:2-t72j=H^867|v%6^4*Cn9V99c8R',
    expire: 14 * 24 * 60 * 60, // 14 Days
    apiExpire: 5 * 60, // 5 minutes
  },

  mocks: {
    path: './mock',
  },

  // mongo: {
  //   host: 'localhost',
  //   // host: 'mongo',   // - docker-compose version
  //   db: 'portal',
  //   // user: 'test',
  //   // pass: 'test',
  //   traceDB: true,
  //   // enableSSL: true,
  //   // sslValidate: false,
  //   // certificate: '<sslMongoDb.cer>',
  //   // replica: '<replset name>',
  // },

  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/portal',
  port: process.env.PORT || 8000,
  analytics: 'UA-106546786-1',
  version: '1.0.0',

};

export default config;
