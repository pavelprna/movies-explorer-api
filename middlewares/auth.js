const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  const { NODE_ENV = 'develop', JWT_SECRET } = process.env;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Присланный токен некорректен'));
  }
};
