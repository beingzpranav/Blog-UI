const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'author', 'reader'], default: 'reader' },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
});

module.exports = mongoose.model('User', userSchema);