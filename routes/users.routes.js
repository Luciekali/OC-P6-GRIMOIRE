const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users.controllers');

router.post('/signup', usersCtrl.signUp);

module.exports = router;