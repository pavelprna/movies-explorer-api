const router = require('express').Router();
const { userValidator } = require('../middlewares/validation');
const { getUser, editUser } = require('../controllers/user');

router.get('/me', getUser);
router.patch('/me', userValidator, editUser);

module.exports = router;
