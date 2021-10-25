const router = require('express').Router();
const { createUserValidator, loginValidator } = require('../middlewares/validation');
const { createUser, login, signout } = require('../controllers/user');

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);
router.post('/signout', signout);

module.exports = router;
