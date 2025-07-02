const express = require('express');

const router = express.Router();


// middleware to verify jwt and attach req.user.id

const requireAuth = require('../middleware/authMiddleware');

// 📌 Controller function (you’ll add it in controllers/buddyController.js)
const {inviteBuddy} = require('../controllers/buddyController');

/**
 * POST /api/buddy/invite
 * Body: { email }
 * Logic handled in inviteBuddy:
 *   1. Find the user by email
 *   2. Set them as your buddy (req.user.id ⇄ foundUser._id)
 *   3. Save both user documents
 */

router.post('/invite', requireAuth, inviteBuddy);

const { inviteBuddy, getBuddyStats } = require('../controllers/buddyController');

// Existing
router.post('/invite', requireAuth, inviteBuddy);

// 🆕 New route
router.get('/stats', requireAuth, getBuddyStats);



module.exports = router;
