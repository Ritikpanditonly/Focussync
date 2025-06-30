const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const { getCurrentUser } = require('../controllers/userController');

// GET /api/user/me → return name, email, focusCoins, streakCount, lastFocusDate
router.get('/me', requireAuth, getCurrentUser);

module.exports = router;
