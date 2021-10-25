const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const {
  VALIDATION_ERROR,
  JWT_SECRET,
  CAST_ERROR,
  errorMessage,
  okMessage,
} = require('../utils/constants');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new BadRequestError(errorMessage.incui);
      }
    })
    .catch((error) => {
      if (error.name === CAST_ERROR) {
        throw new BadRequestError(errorMessage.incorrectUserId);
      } else {
        next(error);
      }
    })
    .catch(next);
};

const editUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id },
    { name, email, password },
    { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(errorMessage.notFoundUserId);
      }
    })
    .catch((error) => {
      if (error.name === VALIDATION_ERROR) {
        throw new BadRequestError(errorMessage.incorrectUpdateUserData);
      } else if (error.code === 11000) {
        throw new ConflictError(errorMessage.conflictUserEmail(email));
      } else {
        next(error);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => {
        res.send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      }))
    .catch((error) => {
      if (error.name === VALIDATION_ERROR) {
        throw new BadRequestError(errorMessage.incorrectCreateUserData);
      } else if (error.code === 11000) {
        throw new ConflictError(errorMessage.conflictUserEmail(email));
      } else {
        next(error);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
        .send({ message: okMessage.signInDone });
    })
    .catch((error) => {
      throw new UnauthorizedError(error.message);
    })
    .catch(next);
};

const signout = (req, res, next) => {
  res.clearCookie('jwt').send({ message: okMessage.signOutDone });
  next();
};

module.exports = {
  getUser, editUser, createUser, login, signout,
};
