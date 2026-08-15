const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and file exist for fallback storage
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

const getLocalUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Generate JWT and set HTTP-only cookie
const generateToken = (res, userId, role) => {
  const secret = process.env.JWT_SECRET || 'netflix_clone_secret_key_2024';
  const token = jwt.sign({ id: userId, role }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  // Set HTTP-only cookie
  res.cookie('netflix_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// Check if MongoDB is currently connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// exports.checkEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: 'Please provide email' });
//     }

//     const cleanEmail = email.toLowerCase().trim();
//     let exists = false;

//     if (isMongoConnected()) {
//       const user = await User.findOne({ email: cleanEmail });
//       exists = !!user;
//     } else {
//       const users = getLocalUsers();
//       exists = users.some((u) => u.email === cleanEmail);
//     }

//     return res.status(200).json({ success: true, exists });
//   } catch (error) {
//     console.error('Check email error:', error);
//     res.status(500).json({ message: 'Server error checking email' });
//   }
// };


// server/controllers/authController.js

// @desc    Check if email exists
// @route   POST /api/auth/check-email
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let exists = false;

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      exists = !!user;
    } else {
      const users = getLocalUsers();
      exists = users.some((u) => u.email === cleanEmail);
    }

    return res.status(200).json({ success: true, exists });
  } catch (error) {
    console.error('Check email error:', error);
    return res.status(500).json({ success: false, message: 'Server error checking email' });
  }
};

// @desc    Login using only email (passwordless)
// @route   POST /api/auth/login-email
exports.loginEmailOnly = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = generateToken(res, user._id.toString(), user.role);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profiles: user.profiles,
        },
      });
    } else {
      // Local fallback storage
      const users = getLocalUsers();
      const user = users.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = generateToken(res, user._id, user.role);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profiles: user.profiles,
        },
      });
    }
  } catch (error) {
    console.error('Login email error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const user = await User.create({
        email: cleanEmail,
        password,
        profiles: [{ name: 'User', avatar: '/avatars/default.png', isKids: false }],
      });

      const token = generateToken(res, user._id.toString(), user.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profiles: user.profiles,
        },
      });
    } else {
      // Local fallback storage
      const users = getLocalUsers();
      const existingUser = users.find((u) => u.email === cleanEmail);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'usr_' + Date.now() + Math.random().toString(36).substr(2, 5),
        email: cleanEmail,
        password: hashedPassword,
        profiles: [{ name: 'User', avatar: '/avatars/default.png', isKids: false }],
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveLocalUsers(users);

      const token = generateToken(res, newUser._id, newUser.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          profiles: newUser.profiles,
        },
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(res, user._id.toString(), user.role);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profiles: user.profiles,
        },
      });
    } else {
      // Local fallback storage
      const users = getLocalUsers();
      const user = users.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(res, user._id, user.role);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profiles: user.profiles,
        },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Verify token / get current user
// @route   GET /api/auth/verify
exports.verify = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profiles: user.profiles,
        },
      });
    } else {
      const users = getLocalUsers();
      const user = users.find((u) => u._id === req.user.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profiles: user.profiles,
        },
      });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  res.cookie('netflix_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: 'Logged out' });
};
