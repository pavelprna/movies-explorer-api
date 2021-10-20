const bcrypt = require('bcrypt');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const getUser = (req, res, next) => {
  User.findById(req.params.id)
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
  console.log(req.body);
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

module.exports = {
  getUser, editUser, createUser,
};
