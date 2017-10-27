// ==============================================================
// Written by steve saxton <steves@codeuniquely.co.uk>
// Copyright (c) 2017 Code Uniquely Ltd.
// Database operations and helpers.
// ==============================================================
module.exports = function database(injectables) { // mongoose, promise, fs) {

  // const handler = null;
  const options = {};

  const config = injectables.config.mongo;

  const mongooseRef = injectables.mongoose;
  const mongoose = injectables.mongoose;

  // const mongoose = injectables.mongoose;
  // const fs       = injectables.fs;

  let url;
  let mode;
  let trace;

  function handleError(err) {
    if (this.handler) {
      this.handler(err);
    }
  }

  function configure(/* config */) {

    const {
      db,
      host,
      user,
      pass,
      replica,
      enableSSL,
      sslValidate,
      certificate,
      traceDB,
    } = config;

    if (config.user) {
      url = `mongodb://${user}:${pass}@${host}/${db}`;
    } else {
      url = `mongodb://${host}/${db}`;
    }

    // // has a replication set been configured
    if (replica) {
      url += `?replicaSet=${replica}`;
      mode = 'replSet';
    } else {
      mode = 'server';
    }

    // was SSL enabled, if so update the URL
    if (enableSSL) {
      if (replica) {
        url += '&ssl=true';
      } else {
        url += '?ssl=true';
      }
    }

    // build the basic 'mode' configuration options block
    options[mode] = {
      auto_reconnect: true, // eslint-disable-line camelcase
      socketOptions: {
        keepAlive: 120,
      },
    };

    // if a SSL has been been configured
    if (typeof enableSSL !== 'undefined') {
      options[mode].ssl = enableSSL;
    }

    // // check SSL validation has been configured
    if (typeof sslValidate !== 'undefined') {
      options[mode].sslValidate = sslValidate;
    }

    // if a SSL certificate has been specified
    if (certificate) {
      // options[mode].sslCA = fs.readFileSync(certificate);
    }

    // Show 'execution plan' for queries ??
    if (traceDB) {
      trace = traceDB;
    }

    // set 'mongoClient' - removed Deprecation warning
    // options.useMongoClient = true;

    // FIX the 'Promise' DEPRECATION ISSUE - provide a promise library
    mongooseRef.Promise = global.Promise; // promise;
  }

  // // MongoDB Connection
  // mongoose.connect(serverConfig.mongoURL, (error) => {
  //   if (error) {
  //     console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
  //     throw error;
  //   }
  //   console.log('Conected to Mongo...'); // eslint-disable-line no-console
  //   // feed dummy data into DB.
  //   dummyData();
  // });

  function connect(callback) {
    if (mongoose.connection.db) {
      console.log('\nEXISTING DB CONECTION - REUSE');
      return callback(null, url, options);
    }
    if (!url) {
      const err = new Error('Mongoose configuration has not been initialised');
      return handleError(err);
    }

    mongoose.connection.on('connected', err => {
      return callback(err, url, options);
    });

    if (trace) {
      mongoose.set('debug', true);
    }

    // FIX DEPRECATION ISSUE - provide a promise library
    // console.log('PROMISE IS ', promise); // eslint-disable-line no-console
    // mongoose.Promise = promise;

    // connect to mongoose
    return mongoose.connect(url, options);
  }

  function disconnect(callback) {
    mongoose.disconnect(callback);
  }

  function errorHandler(handler) {
    this.handler = handler;
    // DB.handler = handler;
  }

  mongoose.connection.on('error', handleError);

  mongoose.connection.on('disconnected', handleError);

  // ===================================
  // Disconnect DB if the app terminates
  // ===================================
  process.on('SIGINT', () => {
    disconnect(() => {
      process.exit(0);
    });
  });

  return {
    configure,
    connect,
    disconnect,
    errorHandler,
  };
};

// module.exports = DB;
