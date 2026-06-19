const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const EventNews = require('../models/EventNews');

// --- USERS ---
router.get('/users', adminAuth, async (req, res) => {
  const users = await User.find();
  res.json(users);
});
router.delete('/users/:id', adminAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// --- DOCTORS ---
router.get('/doctors', adminAuth, async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});
router.post('/doctors', adminAuth, async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
});
router.delete('/doctors/:id', adminAuth, async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Doctor deleted' });
});

// --- APPOINTMENTS ---
router.get('/appointments', adminAuth, async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});
router.delete('/appointments/:id', adminAuth, async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Appointment deleted' });
});

// --- EVENTS & NEWS ---
router.get('/events-news', adminAuth, async (req, res) => {
  const items = await EventNews.find();
  res.json(items);
});
router.post('/events-news', adminAuth, async (req, res) => {
  const item = await EventNews.create(req.body);
  res.status(201).json(item);
});
router.delete('/events-news/:id', adminAuth, async (req, res) => {
  await EventNews.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event/News deleted' });
});

module.exports = router; 