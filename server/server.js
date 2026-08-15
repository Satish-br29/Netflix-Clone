const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'https://netflix-clone-one-tau-98.vercel.app',
      'https://netflix-clone-fy828yh42-satish-stuffs.vercel.app',
      'https://netflix-clone-c25wsq613-satish-stuffs.vercel.app'
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'mongodb' : 'local-storage',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

// Start server immediately
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB Atlas if MONGO_URI is configured
if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('your_mongodb_atlas_uri_here')) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.warn('⚠️ MongoDB Atlas connection warning:', err.message, '- Using local storage engine fallback.'));
} else {
  console.log('ℹ️ Running in fast local storage mode (Ready for instant registration & login). Add MONGO_URI to .env whenever you want to connect MongoDB Atlas.');
}
