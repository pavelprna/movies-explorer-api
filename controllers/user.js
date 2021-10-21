const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new BadRequestError('Нет пользователя с таким _id');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Неверно указан _id пользователя');
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
        throw new NotFoundError('Нет пользователя с таким _id');
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
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
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else if (error.code === 11000) {
        throw new ConflictError(`email ${email} уже зарегистрирован`);
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
      const { NODE_ENV = 'develop', JWT_SECRET } = process.env;

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
        .send({ message: 'Вход выполнен' });
    })
    .catch((error) => {
      throw new UnauthorizedError(error.message);
    })
    .catch(next);
};

module.exports = {
  getUser, editUser, createUser, login,
};
