import { useEffect, useState } from 'react';
import axios from 'axios';
import "./MovieCard.css";

const MovieCard = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("http://localhost:3000/movies");
                setMovies(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
                setError("Failed to load movies. Please try again later.");
            }
        };

        fetchMovies();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="movie-container">
            <h1 className="heading">Explore Movies</h1>
            <div className="movie-list">
                {movies.map((movie) => (
                    <div className="movie-card" key={movie._id}>
                        <h2>{movie.title}</h2>
                        <p><strong>Genre:</strong> {movie.genre.join(", ")}</p>
                        <p><strong>Release Year:</strong> {movie.releaseYear}</p>
                        <p><strong>Rating:</strong> {movie.rating} / 10</p>
                        <p><strong>Streaming Platforms:</strong> {movie.streamingPlatforms.join(", ")}</p>
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
                        <p><strong>Mood Tags:</strong> {movie.moodTags.join(", ")}</p>
                        <p><strong>Language:</strong> {movie.language}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieCard;
