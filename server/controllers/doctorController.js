const Doctor = require('../models/Doctor');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        console.log('Doctors:', doctors);
        res.status(200).json({ data: doctors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new doctor
exports.createDoctor = async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        const savedDoctor = await doctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add review to doctor
exports.addReview = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const review = {
            user: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        };

        doctor.reviews.push(review);
        
        // Update average rating
        const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
        doctor.rating = totalRating / doctor.reviews.length;

        await doctor.save();
        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 