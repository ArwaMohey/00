const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    contact: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    image: {
        type: String,
        default: 'default-doctor.jpg'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema); 