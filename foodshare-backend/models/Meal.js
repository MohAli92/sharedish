const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  availablePortions: { type: Number, default: 1 },
  dietaryTags: [{ type: String }],
  pickupTime: { type: Date },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: true },
  status: { type: String, enum: ['available', 'reserved', 'claimed'], default: 'available' },
  giver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);