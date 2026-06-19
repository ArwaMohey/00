const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/nutritionists', require('./routes/nutritionistRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/crud', require('./routes/adminCrudRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/health-tracker', require('./routes/healthTrackerRoutes'));

const PORT = process.env.PORT || 5000;

// Wrap the server startup in a try-catch block
try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Environment variables:', {
            PORT: process.env.PORT,
            MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set',
            JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
        });
    });
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}