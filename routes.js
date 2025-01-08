const express = require('express');
const router = express.Router();
const Movie = require('./schema'); // Ensure this is your Movie model

// CREATE: Add a new movie
router.post('/movies', async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        const savedMovie = await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', data: savedMovie });
    } catch (error) {
        res.status(400).json({ message: 'Error adding movie', error });
    }
});

// READ: Get all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error });
    }
});

// UPDATE: Update a movie by ID
router.put('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie updated successfully', data: updatedMovie });
    } catch (error) {
        res.status(500).json({ message: 'Error updating movie', error });
    }
});

// DELETE: Delete a movie by ID
router.delete('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully', data: deletedMovie });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting movie', error });
    }
});

module.exports = router;
