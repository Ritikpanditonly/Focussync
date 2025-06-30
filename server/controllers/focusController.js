const User = require('../models/User');

/**
 * PATCH /api/focus/completeSession
 * – Adds 1 focus coin
 * – Maintains daily streak (lastFocusDate, streakCount)
 */
exports.completeSession = async (req, res) => {
  try {
    /* ──────────────────────────────────────
     * 1. Today’s date string (ignores time)
     * ────────────────────────────────────── */
    const todayStr = new Date().toDateString();       // e.g. "Mon Jun 30 2025"

    /* ──────────────────────────────────────
     * 2. Load the user from JWT middleware
     * ────────────────────────────────────── */
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    /* ──────────────────────────────────────
     * 3. Streak logic
     * ────────────────────────────────────── */
    const lastStr = user.lastFocusDate
      ? new Date(user.lastFocusDate).toDateString()
      : null;

    if (lastStr === todayStr) {
      // Already logged a session today → nothing changes
      return res.json({
        message: 'Session already recorded for today',
        coins: user.focusCoins,
        streak: user.streakCount
      });
    }

    // Determine if yesterday was the last session day
    const yesterdayStr = new Date(Date.now() - 86400000).toDateString(); // 86 400 000 ms = 1 day
    if (lastStr === yesterdayStr) {
      user.streakCount += 1;           // Continue streak
    } else {
      user.streakCount = 1;            // Reset streak
    }

    /* ──────────────────────────────────────
     * 4–6. Update date, coins, and save
     * ────────────────────────────────────── */
    user.lastFocusDate = new Date();   // keep full timestamp for history
    user.focusCoins += 1;

    await user.save();

    return res.json({
      message: 'Session recorded',
      coins: user.focusCoins,
      streak: user.streakCount
    });
  } catch (err) {
    console.error('completeSession error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
