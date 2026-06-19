const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, studentId, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ studentId });
    if (userExists) {
      console.log('User already exists:', studentId);
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user with profile
    const user = await User.create({
      name,
      studentId,
      email,
      password,
      profile: {
        avatar: 'default-avatar.png',
        bio: '',
        phone: '',
        address: '',
        dateOfBirth: null
      }
    });

    console.log('User created successfully:', user._id);
    
    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Validate studentId & password
    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a student ID and password'
      });
    }

    // Check for user
    const user = await User.findOne({ studentId }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};