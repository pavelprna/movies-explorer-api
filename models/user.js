const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неверный email',
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
    maxlength: 30
  },
});

module.exports = mongoose.model('user', userSchema);
