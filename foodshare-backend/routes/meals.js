const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create a new meal
router.post('/', upload.single('mealImage'), async (req, res) => {
  try {
    const { title, description, location, availablePortions, dietaryTags, pickupTime, isFree, price } = req.body;
    
    const meal = new Meal({
      title,
      description,
      location,
      availablePortions,
      dietaryTags: JSON.parse(dietaryTags),
      pickupTime,
      isFree,
      price,
      giver: req.user.userId,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all meals
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().populate('giver', 'name phone');
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;