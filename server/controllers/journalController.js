const Journal = require('../models/Journal');

/* POST /api/journal  → add or update today’s entry */
exports.addJournalEntry = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const start = new Date(); start.setHours(0,0,0,0);
    const end   = new Date(); end.setHours(23,59,59,999);

    let entry = await Journal.findOne({ user: req.user.id, date: { $gte: start, $lte: end } });
    if (entry) {
      entry.content = content;
      await entry.save();
      return res.json({ message: 'Journal updated', entry });
    }

    entry = new Journal({ user: req.user.id, content });
    await entry.save();
    res.status(201).json({ message: 'Journal created', entry });
  } catch (err) {
    console.error('addJournalEntry error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* GET /api/journal  → all entries for logged‑in user */
exports.getJournalEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error('getJournalEntries error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* PATCH /api/journal/:id  → edit a specific entry */
exports.updateJournalEntry = async (req, res) => {
  try {
    const { content } = req.body;
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content },
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Journal updated', entry });
  } catch (err) {
    console.error('updateJournalEntry error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
