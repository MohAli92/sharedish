const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ تحقق التوكن

// 📦 Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ✅ POST /api/meals - Protected Route
router.post('/', authMiddleware, upload.single('mealImage'), async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // ✅ السطر المضاف
    console.log('Uploaded file:', req.file);

    const {
      title,
      description,
      location,
      availablePortions,
      dietaryTags,
      pickupTime,
      isFree,
      price
    } = req.body;

    const meal = new Meal({
      title,
      description,
      location,
      availablePortions,
      dietaryTags: JSON.parse(dietaryTags),
      pickupTime,
      isFree,
      price,
      giver: req.user.id,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    console.error('❌ Meal creation error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// 🌍 GET /api/meals - Public
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().populate('giver', 'username phone');
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
