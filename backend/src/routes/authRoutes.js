const express = require('express');
const { register, login, sendOTP, verifyOTP, getMe, updateDetails, deleteMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp-send', sendOTP);
router.post('/otp-verify', verifyOTP);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.delete('/deleteme', protect, deleteMe);


module.exports = router;
