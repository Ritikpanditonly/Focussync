const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/authMiddleware');
const {
  addReward,
  getRewards,
  unlockReward
} = require('../controllers/rewardController');

// All routes below require auth token
router.use(requireAuth);  // ✅ Apply to all routes in this file

// POST /api/rewards → Add new reward
router.post('/', addReward);

// GET /api/rewards → Get all user rewards
router.get('/', getRewards);

// PATCH /api/rewards/:id/unlock → Deduct coins + mark as unlocked
router.patch('/:id/unlock', unlockReward);

module.exports = router;
