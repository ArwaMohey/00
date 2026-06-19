const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route POST /api/admin/login
exports.login = async (req, res) => {
  const { studentId, password } = req.body;
  const admin = await Admin.findOne({ username: studentId });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(admin._id);
  res.json({
    _id: admin._id,
    username: admin.username,
    role: admin.role,
    token
  });
};

// @route POST /api/admin/create
exports.create = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields required' });
  const exists = await Admin.findOne({ username });
  if (exists) return res.status(400).json({ message: 'Admin already exists' });
  const admin = await Admin.create({ username, password });
  res.status(201).json({ _id: admin._id, username: admin.username, role: admin.role });
}; 