const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

// Protected routes (require authentication)
router.post('/', auth, doctorController.createDoctor);
router.put('/:id', auth, doctorController.updateDoctor);
router.delete('/:id', auth, doctorController.deleteDoctor);
router.post('/:id/reviews', auth, doctorController.addReview);

module.exports = router; 