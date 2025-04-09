const sequelize = require('./config/db');
const User = require('./models/User');
const Movie = require('./models/Movies');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });

    const hashedPasswords = await Promise.all([
      bcrypt.hash('pass1', 10),
      bcrypt.hash('pass2', 10),
      bcrypt.hash('pass3', 10)
    ]);

    const users = await User.bulkCreate([
      { name: 'Alice', email: 'alice@example.com', password: hashedPasswords[0] },
      { name: 'Bob', email: 'bob@example.com', password: hashedPasswords[1] },
      { name: 'Charlie', email: 'charlie@example.com', password: hashedPasswords[2] }
    ]);

    await Movie.bulkCreate([
      { title: 'Inception', genre: 'Sci-Fi', description: 'A dream heist', created_by: users[0].id },
      { title: 'Interstellar', genre: 'Sci-Fi', description: 'Space and time', created_by: users[1].id },
      { title: 'Tenet', genre: 'Action', description: 'Time inversion', created_by: users[2].id }
    ]);

    console.log('Seeding successful!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
