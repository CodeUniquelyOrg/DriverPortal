// ==============================================================
// Written by steve saxton <steves@codeuniquely.co.uk>
// Load any Dummy Data into Mongooose if Required
// ==============================================================
module.exports = function shell(injectables, callback) {

  const async = injectables.async;
  const mongoose = injectables.mongoose;

  function dropCollections(done) {
    const collections = Object.keys(mongoose.connection.collections);

    console.log(''); // eslint-disable-line no-console
    async.forEach(collections, (name,cb) => {

      if (name === 'identitycounters') {
        return cb();
      }

      const collection = mongoose.connection.collections[name];

      console.log('Dropping ' + name); // eslint-disable-line no-console
      collection.drop( () => {
        cb();
      });

    }, done);
  }

  // function convertPSI(psi) {
  //   return psi * 6.8947573;
  // }

  // function convertBar(bar) {
  //   return bar * 100;
  // }

  function loadUsers(done) {

    // get the Schema models
    const dbCollection = mongoose.model('users'); // require('../models/model.user')();

    // Get the 'fixture' data
    const mockUsers = require('./users.json');

    // Inject the data if no data records exist
    dbCollection.count().exec((err, count) => {
      if (err) {
        return done(err);
      }
      if (count > 0) {
        return done(null, null);
      }

      const data = mockUsers.users;
      if (!data || data.length === 0) {
        return done(null, null);
      }

      // *** ENCRYPT THE DATA WE GOT IN PASSWORD ***

      dbCollection.create(data, (error) => {
        if (error) {
          console.log('USERS ERROR ', error);  // eslint-disable-line no-console
          return done(error);
        }
        return done();
      });
    });
  }

  // load all the data - Async
  async.waterfall([
    // (cb1) => {
    //   dropCollections(cb1);
    // },
    (cb1) => {
      loadUsers(cb1);
    },
    // (cb1) => {
    //   loadConfig(cb1);
    // },
  ], callback);

};
