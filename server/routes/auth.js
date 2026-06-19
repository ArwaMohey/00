const express = require('express');
const authController = require('../controllers/authController');
const createRateLimiter = require('../middleware/rateLimit');

const router = express.Router();
const authRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 50 });

router.use(authRateLimiter);
router.post('/signup', authController.register);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
