import { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieCard.css';

const MovieCard = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        releaseYear: '',
        rating: '',
        streamingPlatforms: '',
        cast: '',
        moodTags: '',
        language: ''
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const castArray = formData.cast.split(',').map((item) => {
                const [name, role] = item.split(':').map((str) => str.trim());
                return { name, role };
            });
            const formattedMovie = {
                ...formData,
                genre: formData.genre.split(',').map((g) => g.trim()),
                streamingPlatforms: formData.streamingPlatforms.split(',').map((p) => p.trim()),
                moodTags: formData.moodTags.split(',').map((tag) => tag.trim()),
                cast: castArray,
                releaseYear: parseInt(formData.releaseYear),
                rating: parseFloat(formData.rating)
            };

            if (editMode) {
                // Update movie
                await axios.put(`http://localhost:3000/movies/${currentMovieId}`, formattedMovie);
                setEditMode(false);
                setCurrentMovieId(null);
            } else {
                // Add new movie
                await axios.post('http://localhost:3000/movies', formattedMovie);
            }

            fetchMovies();
            setFormData({
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
            console.error('Error saving movie:', error);
            alert('Failed to save the movie. Please try again.');
        }
    };

    const handleEdit = (movie) => {
        setEditMode(true);
        setCurrentMovieId(movie._id);
        setFormData({
            title: movie.title,
            genre: movie.genre.join(', '),
            releaseYear: movie.releaseYear,
            rating: movie.rating,
            streamingPlatforms: movie.streamingPlatforms.join(', '),
            cast: movie.cast.map((c) => `${c.name}:${c.role}`).join(', '),
            moodTags: movie.moodTags.join(', '),
            language: movie.language
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/movies/${id}`);
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
            alert('Failed to delete the movie. Please try again.');
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="movie-container">
            <h1 className="heading">Explore Movies</h1>
            <button className="add-movie-button" onClick={() => { setShowForm(true); setEditMode(false); }}>
                Add Movie
            </button>
            {showForm && (
                <div className="form-modal">
                    <form onSubmit={handleSubmit} className="movie-form">
                        <h2>{editMode ? 'Update Movie' : 'Add New Movie'}</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="genre"
                            placeholder="Genre (comma-separated)"
                            value={formData.genre}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="releaseYear"
                            placeholder="Release Year"
                            value={formData.releaseYear}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="rating"
                            placeholder="Rating (0-10)"
                            value={formData.rating}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="streamingPlatforms"
                            placeholder="Streaming Platforms (comma-separated)"
                            value={formData.streamingPlatforms}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="cast"
                            placeholder="Cast (format: name:role, name:role)"
                            value={formData.cast}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                        <input
                            type="text"
                            name="moodTags"
                            placeholder="Mood Tags (comma-separated)"
                            value={formData.moodTags}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="language"
                            placeholder="Language"
                            value={formData.language}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit" className="submit-button">
                            {editMode ? 'Update' : 'Submit'}
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
                        <div className="cast-section">
                            <strong >Cast:</strong>
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
                        <button className="edit-button" onClick={() => handleEdit(movie)}>Update</button>
                        <button className="delete-button" onClick={() => handleDelete(movie._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieCard;
