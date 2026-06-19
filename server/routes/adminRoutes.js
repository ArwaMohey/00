const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Login
router.post('/login', adminController.login);
// Create admin (for initial setup, you can remove or protect this after first use)
router.post('/create', adminController.create);

module.exports = router; 