const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.use('./auth');

router.use(auth);

router.use(require('./user'));
router.use(require('./movie'));

router.all('*', () => {
  throw new NotFoundError('Ресурс не найден');
});
