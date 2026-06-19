const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  doctorId: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Appointment', appointmentSchema); 