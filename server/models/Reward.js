const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  cost: Number,
  isUnlocked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reward', rewardSchema);
