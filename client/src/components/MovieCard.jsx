import { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieCard.css';
import { useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';

const MovieCard = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState(null);
    const [selectedUser, setSelectedUser] = useState('');
    const navigate = useNavigate();
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
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        try {
            setUser(JSON.parse(userData));
            fetchMovies();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [navigate]);

    const fetchMovies = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            let url = 'http://localhost:3000/api/movies';
            if (selectedUser) {
                // url = `http://localhost:3000/api/movies/user/${selectedUser}`;
                url = `http://localhost:3000/api/sql/movies/user/${selectedUser}`;
            }
            
            console.log('Fetching movies with headers:', headers);
            const response = await axios.get(url, { headers });
            console.log('Movies response:', response.data);
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error.response || error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError(error.message);
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchMovies();
        }
    }, [selectedUser]);

    if (!user) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
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
                await axios.put(`http://localhost:3000/api/movies/${currentMovieId}`, formattedMovie, { headers });
                setEditMode(false);
                setCurrentMovieId(null);
            } else {
                await axios.post('http://localhost:3000/api/movies', formattedMovie, { headers });
            }

            // Reset form
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

            // Fetch movies based on current selection
            if (selectedUser) {
                const response = await axios.get(`http://localhost:3000/api/movies/user/${selectedUser}`, { headers });
                setMovies(response.data);
            } else {
                const response = await axios.get('http://localhost:3000/api/movies', { headers });
                setMovies(response.data);
            }
        } catch (error) {
            console.error('Error saving movie:', error.response?.data || error);
            alert(error.response?.data?.message || 'Failed to save the movie. Please try again.');
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
            const token = localStorage.getItem('token');
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            await axios.delete(`http://localhost:3000/api/movies/${id}`, { headers });
            await fetchMovies();
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
            <header className="navbar">
                <div className="logo">FlickVibes</div>
                <nav>
                    <ul className="nav-links">
                        <li>
                            <button onClick={() => navigate('/')} className="auth-button">
                                Home
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    navigate('/');
                                }}
                                className="auth-button"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="content">
                <div className="main-content">
                    <div className="content-header">
                        <h1 className="heading">Explore Movies</h1>
                        <div className="actions">
                            <UserDropdown onSelectUser={setSelectedUser} />
                            <button className="add-movie-button" onClick={() => { setShowForm(true); setEditMode(false); }}>
                                Add Movie
                            </button>
                        </div>
                    </div>

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
                                <p>Created by: {movie.created_by ? movie.created_by.name : 'Unknown'}</p>
                                <button className="edit-button" onClick={() => handleEdit(movie)}>Update</button>
                                <button className="delete-button" onClick={() => handleDelete(movie._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
