const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new BadRequestError('Нет пользователя с таким id');
      }
    })
    .catch(next);
};

module.exports = {
  getUser,
};
