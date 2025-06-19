// foodshare-backend\routes\auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OtpCode = require('../models/OtpCode');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

const sendOtpFunction = require('./otp').sendOtpFunction; // لا بأس لو نعرف sendOtpFunction 

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;

  console.log('📩 Data received for registration:', req.body);

  try {
    if (!username || !password || (!email && !phone)) {
      return res.status(400).json({
        message: 'All fields are required (username, phone or email, password)',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or phone already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      isPhoneVerified: false,
    });

    // إرسال OTP بعد التسجيل
    // سنرسل طلب إلى /api/auth/send-otp داخل السيرفر
    // أو يمكنك استدعاء الوظيفة مباشرة هنا (لو غيرت الكود قليلاً)
    // الآن سنرسل طلب داخلي عبر axios (يحتاج تثبيت axios في backend)
    // أو ننقل وظيفة sendOtp إلى ملف مستقل

    // للأسهل، فقط سجل الرد، وارسله من الواجهة (frontend) مباشرة بعد التسجيل
    // أو في هذا المثال نتركه frontend

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
      message: 'User registered successfully. Please verify your phone number.',
    });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  console.log('🔐 Login attempt:', req.body);

  try {
    const identifier = email || phone;

    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Email or phone and password are required',
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials (user not found)',
      });
    }

    // هنا نمنع الدخول لو الهاتف غير مفعل
    if (!user.isPhoneVerified) {
      return res.status(401).json({
        message: 'Please verify your phone number before login',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials (wrong password)',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// GET CURRENT USER
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

module.exports = router;
