const { INTERNAL_SERVER_CODE } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_CODE, message } = err;
  if (statusCode === INTERNAL_SERVER_CODE) {
    res.status(statusCode).send('Ошибка на сервере');
  } else {
    res.status(statusCode).send({ message });
  }
  return next;
};
