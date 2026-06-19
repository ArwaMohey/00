const express = require('express');
const { register, login } = require('../controllers/authController');
const createRateLimiter = require('../middleware/rateLimit');

const router = express.Router();
const authRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 50 });

router.use(authRateLimiter);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
