// 1. Import mongoose
const mongoose = require('mongoose');

// 2. Create User schema: name, email, password
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
  }
}, {
  timestamps: true // optional: adds createdAt and updatedAt
});

// 3. Export model
module.exports = mongoose.model('User', userSchema);
