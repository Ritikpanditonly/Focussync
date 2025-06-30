const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  focusCoins: {
    type: Number,
    default: 0
  },

  // 🆕 Track last focus session date
  lastFocusDate: {
    type: Date
  },

  // 🆕 Consecutive day streak counter
  streakCount: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
