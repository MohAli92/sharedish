// foodshare-backend/models/OtpCode.js
const mongoose = require('mongoose');

const OtpCodeSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true }, // رقم الهاتف مع مفتاح الدولة
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

OtpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // حذف تلقائي بعد الانتهاء

module.exports = mongoose.model('OtpCode', OtpCodeSchema);
