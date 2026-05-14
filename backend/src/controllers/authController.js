const User = require('../models/User');
const OTP = require('../models/otpModel');
const jwt = require('jsonwebtoken');

// @desc    Send OTP to email
// @route   POST /api/v1/auth/otp-send
// @access  Public
exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB
    await OTP.create({ email, otp });

    // In production, send via Email (Nodemailer) or SMS
    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/otp-verify
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and otp' });
    }

    // Check latest OTP for this email
    const otpData = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpData || otpData.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Find user or create if new
    let user = await User.findOne({ email });
    if (!user) {
      // Create a skeleton user for OTP login if they don't exist
      user = await User.create({
        name: email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-8) // Random dummy password
      });
    }

    // Delete OTP after verification
    await OTP.deleteMany({ email });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};


// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Neenga innum register panalanu' });
    }


    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};
