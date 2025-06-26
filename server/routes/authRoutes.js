const express = require('express');
const router = express.Router();

// 1. Import controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// 2. POST /register → registerUser
router.post('/register', registerUser);

// 3. POST /login → loginUser
router.post('/login', loginUser);

module.exports = router;
