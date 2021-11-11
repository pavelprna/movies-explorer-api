const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const { errorMessage } = require('../utils/constants');

router.use(require('./auth'));

router.use(auth);

router.use(require('./user'));
router.use(require('./movie'));

router.all('*', () => {
  throw new NotFoundError(errorMessage.incorrectRoute);
});

module.exports = router;
