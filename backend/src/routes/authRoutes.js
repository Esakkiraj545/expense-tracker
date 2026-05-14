const express = require('express');
const { register, login, sendOTP, verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp-send', sendOTP);
router.post('/otp-verify', verifyOTP);


module.exports = router;
