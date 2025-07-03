const Reward = require('../models/Reward');
const User = require('../models/User');

/**
 * @desc Get all rewards of the logged-in user
 * @route GET /api/rewards
 */
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ user: req.user.id }).sort({ createdAt: -1 });
    const user = await User.findById(req.user.id).select('focusCoins');
    res.json({ rewards, coins: user.focusCoins });
  } catch (err) {
    console.error('getRewards error:', err);
    res.status(500).json({ error: 'Server error while fetching rewards' });
  }
};

/**
 * @desc Add a new reward
 * @route POST /api/rewards
 */
exports.addReward = async (req, res) => {
  try {
    const { title, cost } = req.body;

    if (!title || cost == null) {
      return res.status(400).json({ error: 'Title and cost are required' });
    }

    const reward = new Reward({
      user: req.user.id,
      title,
      cost
    });

    await reward.save();
    res.status(201).json({ message: 'Reward created', reward });
  } catch (err) {
    console.error('addReward error:', err);
    res.status(500).json({ error: 'Server error while adding reward' });
  }
};

/**
 * @desc Unlock a reward
 * @route PATCH /api/rewards/:id/unlock
 */
exports.unlockReward = async (req, res) => {
  try {
    const reward = await Reward.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    if (reward.unlocked) return res.status(400).json({ error: 'Reward already unlocked' });

    const user = await User.findById(req.user.id).select('focusCoins');

    if (user.focusCoins < reward.cost) {
      return res.status(400).json({ error: 'Not enough coins' });
    }

    user.focusCoins -= reward.cost;
    reward.unlocked = true;

    await Promise.all([user.save(), reward.save()]);

    res.json({
      message: 'Reward unlocked',
      coinsRemaining: user.focusCoins,
      reward
    });
  } catch (err) {
    console.error('unlockReward error:', err);
    res.status(500).json({ error: 'Server error while unlocking reward' });
  }
};
