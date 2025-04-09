const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require("cors");
const authRoutes = require('./auth');
const routes = require('./routes');
const CookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Set JWT secret if not in environment variables
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'your-secret-key';
    console.log('Using default JWT secret key');
} else {
    console.log('Using JWT secret from environment variables');
}

// Log JWT secret (first few characters only for security)
// console.log('JWT Secret (first 10 chars):', process.env.JWT_SECRET.substring(0, 10) + '...');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // your frontend origin
    credentials: true
  }));
app.use(CookieParser());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api', routes);

let dbConnectionStatus = 'Disconnected';

// Function to connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        dbConnectionStatus = 'Connected';
        console.log('Successfully connected to MongoDB Atlas');
    } catch (error) {
        dbConnectionStatus = 'Error Connecting';
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

// sql routes
const sqlRoutes = require('./sql/routes/sqlRoutes');
app.use('/api', sqlRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FlickVibes!', dbStatus: dbConnectionStatus });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('JWT Secret:', process.env.JWT_SECRET);
});
