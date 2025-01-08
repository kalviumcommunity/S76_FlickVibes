const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes); 

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

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FlickVibes!', dbStatus: dbConnectionStatus });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
