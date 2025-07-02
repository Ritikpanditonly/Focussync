const User = require('../models/User');

/**
 * POST /api/buddy/invite
 * Body: { email }
 *
 * Steps:
 * 1. Find buddyUser by email
 * 2. Check: can’t invite yourself
 * 3. Update both users’ buddy fields
 * 4. Save both users
 */
exports.inviteBuddy = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    /* 1️⃣ Find buddyUser by email */
    const buddyUser = await User.findOne({ email });
    if (!buddyUser) return res.status(404).json({ error: 'User not found' });

    /* 2️⃣ Self‑invite check */
    if (buddyUser._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot invite yourself' });
    }

    /* 3️⃣ Update both users */
    const currentUser = await User.findById(req.user.id);
    currentUser.buddy   = buddyUser._id;
    buddyUser.buddy     = currentUser._id;

    /* 4️⃣ Save both (parallel) */
    await Promise.all([currentUser.save(), buddyUser.save()]);

    res.json({
      message: 'Buddy linked successfully',
      buddy: {
        id: buddyUser._id,
        name: buddyUser.name,
        email: buddyUser.email
      }
    });
  } catch (err) {
    console.error('inviteBuddy error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBuddyStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('buddy', 'name streakCount focusCoins');

    if (!user.buddy) {
      return res.status(404).json({ error: 'No buddy assigned' });
    }

    res.json({
      name: user.buddy.name,
      streakCount: user.buddy.streakCount,
      focusCoins: user.buddy.focusCoins
    });
  } catch (err) {
    console.error('getBuddyStats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

