const express = require('express');
const router = express.Router();
const Movie = require('./schema');
const User = require('./User');
const { validateMovie } = require('./validation');
const jwt = require('jsonwebtoken');

const handleError = (res, error, customMessage = 'An unexpected error occurred') => {
    console.error(error);
    res.status(500).json({ message: customMessage });
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Received auth header:', authHeader);

        if (!authHeader) {
            console.log('No authorization header found');
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Extracted token:', token);

        if (!token) {
            console.log('No token found in authorization header');
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        console.log('Using JWT secret:', process.env.JWT_SECRET);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Successfully decoded token:', decoded);
            req.user = decoded;
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ message: 'Invalid token.', error: jwtError.message });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token.', error: error.message });
    }
};

// Get all users
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('name email');
        res.status(200).json(users);
    } catch (error) {
        handleError(res, error, 'Error fetching users');
    }
});

// Get all movies
router.get('/movies', verifyToken, async (req, res) => {
    try {
        const movies = await Movie.find().populate('created_by', 'name');
        res.status(200).json(movies);
    } catch (error) {
        handleError(res, error, 'Error fetching movies');
    }
});

// Get movies by user
router.get('/movies/user/:userId', verifyToken, async (req, res) => {
    try {
        const movies = await Movie.find({ created_by: req.params.userId }).populate('created_by', 'name');
        res.status(200).json(movies);
    } catch (error) {
        handleError(res, error, 'Error fetching user movies');
    }
});

// Add new movie
router.post('/movies', verifyToken, async (req, res) => {
    try {
        const { error } = validateMovie(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation failed',
                details: error.details.map((detail) => detail.message),
            });
        }

        const newMovie = new Movie({
            ...req.body,
            created_by: req.user.userId
        });
        const savedMovie = await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', data: savedMovie });
    } catch (error) {
        handleError(res, error, 'Error adding movie');
    }
});

// Update movie
router.put('/movies/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id).populate('created_by', 'name');
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Check if user owns the movie
        if (!movie.created_by || movie.created_by._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this movie' });
        }

        // Remove created_by from req.body to prevent changing the creator
        const { created_by, ...updateData } = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('created_by', 'name');

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found after update' });
        }

        res.status(200).json({ message: 'Movie updated successfully', data: updatedMovie });
    } catch (error) {
        console.error('Update error:', error);
        handleError(res, error, 'Error updating movie');
    }
});

// Delete movie
router.delete('/movies/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Check if user owns the movie
        if (movie.created_by.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this movie' });
        }

        const deletedMovie = await Movie.findByIdAndDelete(id);
        res.status(200).json({ message: 'Movie deleted successfully', data: deletedMovie });
    } catch (error) {
        handleError(res, error, 'Error deleting movie');
    }
});

module.exports = router; 