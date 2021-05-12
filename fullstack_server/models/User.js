const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
const env = require('../config/config');

// JWT Secret to create and validate tokens
const ourSuperSecretKey = env.jwt_key;

// Address Schema (we will nest this in our user schema)
const AddressSchema = new Schema(
  {
    streetNr: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: 'Germany' },
  },
  {
    _id: false,
  }
);

// UserSchema - contains rules how every user should look like
const UserSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: false },
    avatar: { type: String, required: false, default: '/statics/01.png' },
    emailVerificationToken: { type: String, required: true },
    emailIsVerified: { type: Boolean, default: false },
    googleId: { type: String },
    address: AddressSchema, // outsourcing NESTED information into own schema
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      // with "transform" we can hide fields (e.g. password) from our API output
      // transform will always get called when we return a document from API with res.json
      transform: (docOriginal, docToReturn) => {
        delete docToReturn.password; // hide password field in all res.json outputs...
      },
    },
  }
);

// pre save hook - will get triggered by these actions:
// - user.save()
// - User.create()
// - User.insertMany()
UserSchema.pre('save', function () {
  const user = this;
  // convert plain password to password hash (but ONLY if password was modified)
  if (user.isModified('password')) {
    console.log('yeah the pass was modified');
    user.password = bcryptjs.hashSync(user.password, 8); // 8 = salting rounds
  }
});

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

// Generate token method
UserSchema.methods.generateAuthToken = function () {
  console.log(this); // user
  const user = this;
  // additionally making sure, the JWT ticket itself will expire at some point (in this case in 3 hours)
  const token = jwt
    .sign({ _id: user._id.toString() }, ourSuperSecretKey, { expiresIn: '3h' })
    .toString();

  return token;
};

// Generate token method
UserSchema.methods.generateEmailVerifToken = function () {
  const user = this;
  // additionally making sure, the JWT ticket itself will expire at some point (in this case in 3 hours)
  const token = jwt
    .sign({ _id: user._id.toString(), email: user.email }, ourSuperSecretKey, {
      expiresIn: '120h',
    })
    .toString();

  return token;
};

// Find By token
UserSchema.statics.findByToken = function (token) {
  const User = this;

  // Decode the cookie
  try {
    // if the token is valid then we get back whatever we
    // signed the cookie with  -> { _id: user._id.toString() }
    let decoded = jwt.verify(token, ourSuperSecretKey);
    console.log(`decoded`, decoded);
    return User.findOne({ _id: decoded._id });
  } catch (error) {
    return;
  }
};

// Find By verif Token
UserSchema.statics.findByVerifToken = function (token) {
  const User = this;

  // Decode the token
  try {
    // if the token is valid then we get back whatever we
    // signed the token with  -> { _id: user._id.toString() , email: ...}
    let decoded = jwt.verify(token, ourSuperSecretKey);
    console.log(`decoded`, decoded);
    return User.findOne({ _id: decoded._id, email: decoded.email });
  } catch (error) {
    return;
  }
};

// Todo model => our interface to the database (=todos collection)
const User = model('User', UserSchema); // => todos

// we just export the MODEL (not the schema)
module.exports = User;
