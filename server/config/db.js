const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/university_health');
        
        if (!process.env.MONGO_URI) {
            console.warn('Warning: MONGO_URI not set in environment variables, using default local connection');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/university_health', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Database name:', conn.connection.name);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code
        });
        throw error; // Let the server handle the error
    }
};

module.exports = connectDB; 