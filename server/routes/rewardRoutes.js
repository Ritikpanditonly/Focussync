const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');

const {
  getRewards,
  addReward,
  unlockReward
} = require('../controllers/rewardController');

router.use(requireAuth); // protect all routes

// GET all rewards
router.get('/', getRewards);

// POST a new reward
router.post('/', addReward);

// PATCH unlock a reward
router.patch('/:id/unlock', unlockReward);

module.exports = router;
