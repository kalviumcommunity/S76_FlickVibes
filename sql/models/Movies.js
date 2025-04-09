const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Movie = sequelize.define('Movie', {
  title: DataTypes.STRING,
  genre: DataTypes.STRING,
  description: DataTypes.TEXT,
}, {
  timestamps: true,
});

Movie.belongsTo(User, { foreignKey: 'created_by' });

module.exports = Movie;
