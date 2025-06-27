const express = require('express');
const router = express.Router();

// 2. Middleware: Require Auth (JWT token)
const requireAuth = require('../middleware/authMiddleware');

// 3. Controller: Increment focusCoins by 1 for logged-in user
const { completeSession } = require('../controllers/focusController');

// 1. Route: PATCH /api/focus/completeSession
router.patch('/completeSession', requireAuth, completeSession);

module.exports = router;
