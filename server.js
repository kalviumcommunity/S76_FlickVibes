const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGO_URI);
let dbConnectionStatus = 'Disconnected';

async function connectToDatabase() {
    try {
        await client.connect();
        dbConnectionStatus = 'Connected';
        console.log('Successfully connected to MongoDB Atlas');
    } catch (error) {
        dbConnectionStatus = 'Error Connecting';
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FlickVibes!', dbStatus: dbConnectionStatus });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
