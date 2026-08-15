const express = require('express');
const router = express.Router();
const { register, login, verify, logout, checkEmail, loginEmailOnly } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/login-email', loginEmailOnly);
router.post('/check-email', checkEmail);
router.get('/verify', authenticateUser, verify);
router.post('/logout', logout);

module.exports = router;
