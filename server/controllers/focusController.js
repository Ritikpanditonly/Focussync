const User = require('../models/User');

/**
 * PATCH  /api/focus/completeSession
 * Increments the logged-in user’s focusCoins by 1
 */
exports.completeSession = async (req, res) => {
  try {
    /* 1️⃣  Find user from JWT                                                 *
     * ───  The auth middleware should have decoded the token and attached    *
     *      the user’s ID to `req.user.id`.                                   */
    const userId = req.user.id;

    /* 2️⃣  Add 1 to focusCoins (atomic increment) */
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { focusCoins: 1 } },
      { new: true, select: '-password' }      // return the fresh user w/o pwd
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    /* 3️⃣  Return updated user data (or just coins) */
    res.json({
      message: 'Session recorded',
      user: updatedUser,          // full user minus password
      coins: updatedUser.focusCoins
    });

  } catch (err) {
    console.error('completeSession error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
