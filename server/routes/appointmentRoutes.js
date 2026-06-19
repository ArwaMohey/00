const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// جلب كل المواعيد (مثال تجريبي)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    // يمكنك تعديل populate حسب الحاجة
    res.json({
      data: appointments
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

// إضافة موعد جديد
router.post('/', async (req, res) => {
  try {
    const { studentId, doctorId, date, status } = req.body;
    const appointment = await Appointment.create({
      studentId,
      doctorId,
      date,
      status: status || 'Confirmed'
    });
    res.status(201).json({ data: appointment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create appointment' });
  }
});

module.exports = router;
