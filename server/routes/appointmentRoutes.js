const express = require('express');
const auth = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimit');
const {
  getAppointments,
  createAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const router = express.Router();
const appointmentRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 200 });

router.use(appointmentRateLimiter);
router.get('/', auth, getAppointments);
router.post('/', auth, createAppointment);
router.delete('/:id', auth, deleteAppointment);

module.exports = router;
