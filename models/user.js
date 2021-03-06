const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { errorMessage } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: errorMessage.incorrectEmail,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errorMessage.incorrectAuthData));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(errorMessage.incorrectAuthData));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
