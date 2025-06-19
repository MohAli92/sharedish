// foodshare-backend/routes/send-otp.js
const express = require('express');
const router = express.Router();
const OtpCode = require('../models/OtpCode');
const crypto = require('crypto');
const twilio = require('twilio');

// Twilio config (خلي دول في ملف .env في الحقيقة)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Helper: توليد كود OTP عشوائي من 6 أرقام
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// إرسال OTP
router.post('/', async (req, res) => {
  const { phone, method } = req.body;

  if (!phone || !method) {
    return res.status(400).json({ message: 'Phone and method are required' });
  }

  try {
    const otpCode = generateOtp();

    // احذف الأكواد القديمة للمستخدم ده
    await OtpCode.deleteMany({ phone });

    // خزّن الكود الجديد
    const otp = new OtpCode({
      phone,
      code: crypto.createHash('sha256').update(otpCode).digest('hex'),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // ينتهي خلال 5 دقايق
    });
    await otp.save();

    // اختار الوسيلة
    let messageBody = `Your FoodShare verification code is: ${otpCode}`;

    if (method === 'sms') {
      await client.messages.create({
        body: messageBody,
        from: fromNumber,
        to: phone,
      });
    } else if (method === 'whatsapp') {
      await client.messages.create({
        body: messageBody,
        from: 'whatsapp:' + fromNumber,
        to: 'whatsapp:' + phone,
      });
    } else {
      return res.status(400).json({ message: 'Invalid method. Use sms or whatsapp.' });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

module.exports = router;
