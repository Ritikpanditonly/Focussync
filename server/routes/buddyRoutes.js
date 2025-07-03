const express = require('express');
const router = express.Router();

// Middleware to verify JWT and attach req.user.id
const requireAuth = require('../middleware/authMiddleware');

// ✅ Import controller functions (only once)
const { inviteBuddy, getBuddyStats } = require('../controllers/buddyController');

// 🔐 Protect all routes
router.use(requireAuth);

// POST /api/buddy/invite → Invite buddy by email
router.post('/invite', inviteBuddy);

// GET /api/buddy/stats → Get buddy streak/coins info
router.get('/stats', getBuddyStats);

module.exports = router;
