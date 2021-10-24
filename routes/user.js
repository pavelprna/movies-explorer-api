const router = require('express').Router();
const { userValidator } = require('../middlewares/validation');
const { getUser, editUser } = require('../controllers/user');

router.get('users/me', getUser);
router.patch('users/me', userValidator, editUser);

module.exports = router;
