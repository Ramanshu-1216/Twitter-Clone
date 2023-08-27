const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Registration
router.post('/register', UserController.register);

// Login
router.post('/login', UserController.login);

module.exports = router;