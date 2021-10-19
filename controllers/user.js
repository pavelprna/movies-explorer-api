const User = require('../models/user');

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.sedd(user);
      } else {
        res.status(400).send('Нет пользователя с таким id');
      }
    })
    .catch(next);
};

module.exports = {
  getUser,
};
