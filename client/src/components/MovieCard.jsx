import "./MovieCard.css";

const MoviesPage = () => {
  const dummyMovies = Array(9).fill({
    title: "Inception",
    genre: ["Sci-Fi", "Thriller"],
    releaseYear: 2010,
    rating: 8.8,
    streamingPlatforms: ["Netflix", "HBO Max"],
    cast: [
      { name: "Leonardo DiCaprio", role: "Cobb" },
      { name: "Joseph Gordon-Levitt", role: "Arthur" },
    ],
    moodTags: ["Mind-Bending", "Suspenseful"],
    language: "English",
  });

  return (
    <div className="movies-page">
      <h1 className="movies-heading">Explore Movies</h1>
      <div className="movies-grid">
        {dummyMovies.map((movie, index) => (
          <div key={index} className="movie-card">
            <h3>{movie.title}</h3>
            <p><strong>Genre:</strong> {movie.genre.join(", ")}</p>
            <p><strong>Rating:</strong> {movie.rating}/10</p>
            <p><strong>Release Year:</strong> {movie.releaseYear}</p>
            <p><strong>Streaming Platforms:</strong> {movie.streamingPlatforms.join(", ")}</p>
            <p><strong>Language:</strong> {movie.language}</p>
            <div className="cast-info">
              <strong>Cast:</strong>
              <ul>
                {movie.cast.map((actor, idx) => (
                  <li key={idx}>{actor.name} as {actor.role}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
