const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movies');

// Get all SQL users
router.get('/sql/users', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching SQL users', error: err.message });
  }
});

// Get movies by SQL user
router.get('/sql/movies/user/:userId', async (req, res) => {
  try {
    const movies = await Movie.findAll({
      where: { created_by: req.params.userId },
      include: { model: User, attributes: ['name'] }
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching SQL movies', error: err.message });
  }
});

module.exports = router;
