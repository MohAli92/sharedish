// foodshare-backend\models\User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    isPhoneVerified: { type: Boolean, default: false }, // <-- جديد
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
