const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users.controllers');

router.post('/signup', usersCtrl.signUp);
router.post('/login', usersCtrl.login)

module.exports = router;