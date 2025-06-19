const express = require('express');
const router = express.Router();
const OtpCode = require('../models/OtpCode');
const User = require('../models/User');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Helper: توليد كود OTP عشوائي من 6 أرقام
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// إرسال كود التفعيل
// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { phone, method = 'sms' } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const code = generateOtp();

  try {
    // حذف أي كود سابق
    await OtpCode.deleteMany({ phone });

    // حفظ الكود الجديد
    const otpEntry = new OtpCode({
      phone,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 دقائق
    });

    await otpEntry.save();

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    const fromNumber =
      method === 'whatsapp'
        ? 'whatsapp:+14155238886'
        : process.env.TWILIO_PHONE_NUMBER;

    const toNumber =
      method === 'whatsapp'
        ? `whatsapp:${formattedPhone}`
        : formattedPhone;

    const messageBody = `Your FoodShare verification code is: ${code}`;

    await twilioClient.messages.create({
      body: messageBody,
      from: fromNumber,
      to: toNumber,
    });

    console.log(`✅ OTP sent to ${toNumber} via ${method}: ${code}`);

    res.status(200).json({ message: `OTP sent via ${method}` });
  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// التحقق من الكود
// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: 'Phone and code are required' });
  }

  try {
    const record = await OtpCode.findOne({ phone, code });

    if (!record) {
      return res.status(400).json({ message: 'Invalid code or phone number' });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Code has expired' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.isPhoneVerified = true;
    await user.save();

    await OtpCode.deleteMany({ phone });

    res.status(200).json({ message: 'Phone verified successfully' });
  } catch (error) {
    console.error('❌ Error verifying OTP:', error.message);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

module.exports = router;
