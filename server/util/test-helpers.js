// import mongoose from 'mongoose';
// import mockgoose from 'mockgoose';
import * as mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

const mockgoose: Mockgoose = new Mockgoose(mongoose);

// export function connectDB(t, done) {
//   mockgoose(mongoose).then(() => {
//     mongoose.createConnection('mongodb://localhost:27017/mern-test', err => {
//       if (err) t.fail('Unable to connect to test database');
//       done();
//     });
//   });
// }
export function connectDB(t, done) {
  mockgoose.prepareStorage().then(() => {
    mongoose.connect('mongodb://localhost:27017/mern-test');
    mongoose.connection.on('connected', (err) => {
      if (err) {
        t.fail('Unable to connect to test database');
      }
      done();
    });
  });
}

// export function dropDB(t) {
//   mockgoose.reset(err => {
//     if (err) t.fail('Unable to reset test database');
//   });
// }
export function dropDB(t) {
  mockgoose.helper.reset()
    .then((err) => {
      if (err) {
        t.fail('Unable to reset test database');
      }
    })
    .catch(error => t.fail('Exception on reset of test database'));
}
