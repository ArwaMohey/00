const express = require('express');
const auth = require('../middleware/auth');
const {
  getAppointments,
  createAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', auth, getAppointments);
router.post('/', auth, createAppointment);
router.delete('/:id', auth, deleteAppointment);

module.exports = router;
