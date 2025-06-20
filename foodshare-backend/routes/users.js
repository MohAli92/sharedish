const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ تحديث بيانات المستخدم
router.put('/:id', async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

module.exports = router;
