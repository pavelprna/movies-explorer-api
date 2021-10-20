const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

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

module.exports = {
  getUser, editUser,
};
