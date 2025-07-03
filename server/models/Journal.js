const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', journalSchema);
