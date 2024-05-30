import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// const secret = process.env.JWT_SECRET;
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: [true, 'userId cannot be blank.'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Email cannot be blank.'],
      match: [/\S+@\S+\.\S+/, 'Email is invalid.'],
      index: true,
    },
    hash: String,
    salt: String,
    name: {
      type: String,
      required: [true, 'Name cannot be blank.'],
    },
    followedDatasets: [
      {
        type: String,
        required: true,
      },
    ],
    resetToken: String,
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'Field is already taken.' });

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  this.resetToken = null;
};

UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  const secret = process.env.JWT_SECRET;
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  return jwt.sign(
    {
      _id: this._id,
      userId: this.userId,
      name: this.name,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    userId: this.userId,
    name: this.name,
    email: this.email,
    token: this.generateJWT(),
  };
};

export default mongoose.model('User', UserSchema);
