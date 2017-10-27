// =========================================================================================
//  User
// =========================================================================================
// {
//   "_id":          <uuid>,
//   "email:         "steves@codeuniquely.co.uk",
//   "password":     "D0A045DB85FA20B6ECA4C0FD661946651946F0F203B17CE124B964481AB037DA",
//   "createdDate":  "2017-05-01T00:00:00.000",
//   "resetToken":   "b9f7a72e-5b0c-11e7-907b-a6006ad3dba0",
//   "resetDate":    "2017-06-27T08:47:15.294",
//   disabled:       false
// }
// =========================================================================================
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// some useful stuff
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// const ObjectId = mongoose.Types.ObjectId; // Schema.ObjectId;

const roleOptions = [
  'driver',
  'manager',
  'admin',
];

// allowed pressure Units
const pressureUnits = [
  'kpa',
  'psi',
  'bar',
  'none',
];

const depthUnits = [
  'mm',
  '32th',
  'none',
];

const themesAvailable = [
  'light',
  'dark',
];

// https://en.wikipedia.org/wiki/Car_colour_popularity
// const vehicleColours = [
//   'white',
//   'silver',
//   'black',
//   'grey',
//   'blue',
//   'red',
//   'brown',
//   'green',
//   'other',
// ];

// drivers preferences
const preferencesSchema = new Schema({
  language: { type: String, required: true },
  pressureUnits: { type: String, enum: pressureUnits },
  depthUnits: { type: String, enum: depthUnits },
  showUnits: { type: Boolean, default: false },
  showTutorial: { type: Boolean, default: true },

});

// Holding address information - OPTIONL / FUTURE
const addressSchema = new Schema({
  line1: { type: String },
  line2: { type: String },
  line3: { type: String },
  line4: { type: String },
  line5: { type: String },
});

// OPTIONAL - ??? Why is this needed at all
const nameSchema = new Schema({
  pronoun: { type: String }, // MUST be 'Free Text' -
  foreName: { type: String, required: true },
  lastName: { type: String, required: true },
});

// - OPTIONL / FUTURE
const contactBySchema = new Schema({
  mobile: { type: String },
  email: { type: String },

  contactInApp: { type: Boolean, default: false },
  contactBySMS: { type: Boolean, default: false },
  contactByEmail: { type: Boolean, default: false },
  contactInAppDate: { type: Date },
  contactBySMSDate: { type: Date },
  contactByEmailDate: { type: Date },
});

// 'ideal' tyre data - if pressent
const tyreSchema = new Schema({
  id: { type: String, required: true },
  pressure: { type: Number, required: true },
});

const idealSchema = new Schema({
  depth: { type: Number, required: true },
  pressures: [tyreSchema],
});

// ??? - WHY DO WE WANT THIS ????
const vehicleSchema = new Schema({
  make: { type: String },
  model: { type: String },
  year: { type: String },
  color: { type: String },
});

// What a car regsiatrtion will look like
const registrationSchema = new Schema({
  vehicleId: { type: Number },
  ownedBy: { type: ObjectId }, // eslint-disable-line
  sharedWith: [{ type: ObjectId }],
  plate: { type: String, required: true },
  normalizedPlate: { type: String, uppercase: true, required: true }, // ????
  fromDate: { type: Date, default: Date.now, required: true },
  lastViewedDate: { type: Date },
  isRegistered: { type: Boolean, default: false }, //  flag to say if the vehicle is considered registered
  isNewVehicleToUser: { type: Boolean, default: true }, // flag to say if the vehicle is considered new to the user
  isMovedOn: { type: Boolean, default: false }, // flag to say if the vehicle has been split and allocated to another user
  vehicle: vehicleSchema,
  ideal: idealSchema,
});

// stuff about the driver
const personalSchema = new Schema({
  avatar: { type: String },
  greeting: { type: String },
  name: nameSchema,
  contactBy: contactBySchema,
  address: addressSchema,
});

const otherSchema = new Schema({
  essoDeutscheCardNumber: { type: String },
  registeredUser: { type: Boolean, default: false },
  termsAccepted: { type: Boolean, default: false },
  // termsAcceptedVersion: { type: Number },
  // termsAcceptedDate: { type: Date, default: Date.now },
});

const userSchema = new Schema({
  // email: { type: String, required: true. index:{ unique:true, name:'email' } },
  email: { type: String }, // should REALLY, JUST be called 'identity' ***
  password: { type: String },
  disabled: { type: Boolean },

  // future expansion  - reset features
  lastLoggedInDate: { type: Date },
  resetToken: { type: String },
  resetDate: { type: Date },

  // roles applicable to user
  roles: [{ type: String, enum: roleOptions, required: true }],

  // the preferred unit choices
  preferences: preferencesSchema,

  // will have zero or more registration records allocated
  registrations: [registrationSchema],

  personal: personalSchema,

  other: otherSchema,

  // account admin & tracking properties
  created: { type: Date, default: Date.now, required: true },
  updated: { type: Date, default: Date.now, required: true },
});

// *** Really need another identifer - other than EMAIL !!! ***

// Add indexes other than _id
// userSchema.index({ email: 1 }, { unique: true, name: 'email' });
// userSchema.index({ resetToken: 1 }, { name: 'reset-token' });

// on creating a record - before save
userSchema.pre('save', function saveHook(next) {
  const user = this; // eslint-disable-line

  // set the update flag on every save
  user.updated = Date.now();

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(10, (saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    // return bcrypt.hash(user.password, salt, (hashError, hash) => {
    return bcrypt.hash(user.password, salt, null, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }
      // replace a password string with hash value
      user.password = hash;
      return next();
    });
  });
});

export default mongoose.model('User', userSchema);
