const router = require('express').Router();
const { getUser } = require('../controllers/user');

router('/me', getUser);
