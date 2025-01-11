const express = require('express');
const router = express.Router();
const User = require('../models/User');
const admin = require('../config/firebase-config');

// Register User
router.post('/register', async (req, res) => {
  const { uid, name, email, role } = req.body;
  try {
    const user = new User({ uid, name, email, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;