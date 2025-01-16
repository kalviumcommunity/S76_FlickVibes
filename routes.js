const express = require('express');
const router = express.Router();
const Movie = require('./schema');
const { validateMovie } = require('./validation');

const handleError = (res, error, customMessage = 'An unexpected error occurred') => {
    console.error(error);
    res.status(500).json({ message: customMessage });
};

router.post('/movies', async (req, res) => {
    try {
        const { error } = validateMovie(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newMovie = new Movie(req.body);
        const savedMovie = await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', data: savedMovie });
    } catch (error) {
        handleError(res, error, 'Error adding movie');
    }
});

router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        handleError(res, error, 'Error fetching movies');
    }
});

router.put('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie updated successfully', data: updatedMovie });
    } catch (error) {
        handleError(res, error, 'Error updating movie');
    }
});

router.delete('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully', data: deletedMovie });
    } catch (error) {
        handleError(res, error, 'Error deleting movie');
    }
});

module.exports = router;
