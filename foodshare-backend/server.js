const userRoutes = require('./routes/users'); // ✅
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');
const mealRoutes = require('./routes/meals');

const app = express();
const server = http.createServer(app); // ✅ استبدلنا app.listen بالسيرفر ده

// ✅ socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ socket events
io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // 🔁 مثال بسيط (لو حبيت تطوّر الشات بعدين):
  // socket.on('sendMessage', (data) => {
  //   io.emit('receiveMessage', data);
  // });
});

app.set('io', io); // ✅ علشان تستخدمه في أي مكان في الراوترات

// ✅ Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/meals', mealRoutes);

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(5000, () => {
      console.log('🚀 Server running on http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });


  app.use('/api/users', userRoutes); // ✅ ربط مسار API الخاص بالمستخدمين
