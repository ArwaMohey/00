const User = require('../models/User');

const sendAuthResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
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
};

exports.register = async (req, res) => {
  try {
    const { name, studentId, email, password } = req.body;

    if (!name || !studentId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, student ID, email, and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      $or: [{ studentId }, { email: normalizedEmail }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? 'Email is already registered'
            : 'Student ID is already registered'
      });
    }

    const user = await User.create({
      name,
      studentId,
      email: normalizedEmail,
      password,
      profile: {
        avatar: 'default-avatar.png',
        bio: '',
        phone: '',
        address: '',
        dateOfBirth: null
      }
    });

    sendAuthResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendAuthResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
