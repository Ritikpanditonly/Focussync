const Reward = require('../models/Reward');
const User   = require('../models/User');

/* ─────────────────────────────────────────────
 * a. addReward(req, res)
 *    • Extract title & cost
 *    • Attach req.user.id
 *    • Save reward in DB
 * ──────────────────────────────────────────── */
exports.addReward = async (req, res) => {
  try {
    const { title, cost } = req.body;
    if (!title || cost == null) {
      return res.status(400).json({ error: 'Title and cost are required' });
    }

    const reward = new Reward({
      user : req.user.id,   // attach current user
      title,
      cost
    });

    await reward.save();

    res.status(201).json({ message: 'Reward created', reward });
  } catch (err) {
    console.error('addReward error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────
 * b. unlockReward(req, res)
 *    1. Find reward by ID
 *    2. Check if user has enough coins
 *    3. If yes:
 *         • Deduct coins
 *         • Mark unlocked
 *         • Save user & reward
 *    4. If not → 400 “Not enough coins”
 * ──────────────────────────────────────────── */
exports.unlockReward = async (req, res) => {
  try {
    /* 1. Find reward (and ensure it belongs to the user) */
    const reward = await Reward.findOne({
      _id : req.params.id,
      user: req.user.id
    });
    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    if (reward.unlocked) {
      return res.status(400).json({ error: 'Reward already unlocked' });
    }

    /* 2. Fetch user coin balance */
    const user = await User.findById(req.user.id).select('focusCoins');
    if (user.focusCoins < reward.cost) {
      return res.status(400).json({ error: 'Not enough coins' });
    }

    /* 3. Deduct coins, unlock reward, save both */
    user.focusCoins -= reward.cost;
    reward.unlocked  = true;

    await Promise.all([user.save(), reward.save()]);

    /* Success */
    res.json({
      message       : 'Reward unlocked',
      coinsRemaining: user.focusCoins,
      reward
    });
  } catch (err) {
    console.error('unlockReward error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
