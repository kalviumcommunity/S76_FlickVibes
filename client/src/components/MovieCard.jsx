import { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieCard.css';

const MovieCard = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: '',
        genre: '',
        releaseYear: '',
        rating: '',
        streamingPlatforms: '',
        cast: '',
        moodTags: '',
        language: ''
    });

    // Fetch movies from the server
    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:3000/movies');
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setError('Failed to load movies. Please try again later.');
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMovie({ ...newMovie, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const castArray = newMovie.cast.split(',').map((item) => {
                const [name, role] = item.split(':').map((str) => str.trim());
                return { name, role };
            });
            const formattedMovie = {
                ...newMovie,
                genre: newMovie.genre.split(',').map((g) => g.trim()),
                streamingPlatforms: newMovie.streamingPlatforms.split(',').map((p) => p.trim()),
                moodTags: newMovie.moodTags.split(',').map((tag) => tag.trim()),
                cast: castArray,
                releaseYear: parseInt(newMovie.releaseYear),
                rating: parseFloat(newMovie.rating)
            };

            await axios.post('http://localhost:3000/movies', formattedMovie);
            fetchMovies(); // Refresh the movie list
            setNewMovie({
                title: '',
                genre: '',
                releaseYear: '',
                rating: '',
                streamingPlatforms: '',
                cast: '',
                moodTags: '',
                language: ''
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding movie:', error);
            alert('Failed to add the movie. Please try again.');
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="movie-container">
            <h1 className="heading">Explore Movies</h1>
            <button className="add-movie-button" onClick={() => setShowForm(true)}>
                Add Movie
            </button>
            {showForm && (
                <div className="form-modal">
                    <form onSubmit={handleSubmit} className="movie-form">
                        <h2>Add New Movie</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={newMovie.title}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="genre"
                            placeholder="Genre (comma-separated)"
                            value={newMovie.genre}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="releaseYear"
                            placeholder="Release Year"
                            value={newMovie.releaseYear}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="rating"
                            placeholder="Rating (0-10)"
                            value={newMovie.rating}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="streamingPlatforms"
                            placeholder="Streaming Platforms (comma-separated)"
                            value={newMovie.streamingPlatforms}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="cast"
                            placeholder="Cast (format: name:role, name:role)"
                            value={newMovie.cast}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                        <input
                            type="text"
                            name="moodTags"
                            placeholder="Mood Tags (comma-separated)"
                            value={newMovie.moodTags}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="language"
                            placeholder="Language"
                            value={newMovie.language}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
            <div className="movie-list">
                {movies.map((movie) => (
                    <div className="movie-card" key={movie._id}>
                        <h2>{movie.title}</h2>
                        <p><strong>Genre:</strong> {movie.genre.join(', ')}</p>
                        <p><strong>Release Year:</strong> {movie.releaseYear}</p>
                        <p><strong>Rating:</strong> {movie.rating} / 10</p>
                        <p><strong>Streaming Platforms:</strong> {movie.streamingPlatforms.join(', ')}</p>
                        <div>
                            <strong>Cast:</strong>
                            <ul>
                                {movie.cast.map((member, index) => (
                                    <li key={index}>
                                        {member.name} as {member.role}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p><strong>Mood Tags:</strong> {movie.moodTags.join(', ')}</p>
                        <p><strong>Language:</strong> {movie.language}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieCard;
