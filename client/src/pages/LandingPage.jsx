import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo">FlickVibes</div>
        <nav>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero-section">
        <h1>Welcome to FlickVibes</h1>
        <p>Discover, explore, and vibe with your favorite movies and shows.</p>
        <button className="cta-button">Get Started</button>
      </section>

      <section id="features" className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Personalized Recommendations</h3>
            <p>Discover movies and shows tailored just for you.</p>
          </div>
          <div className="feature-card">
            <h3>Trending Now</h3>
            <p>Stay updated with the latest blockbusters and hits.</p>
          </div>
          <div className="feature-card">
            <h3>Stream Anywhere</h3>
            <p>Access your favorite content anytime, anywhere.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          FlickVibes is your ultimate destination for discovering and enjoying the best in entertainment. Dive into a world of movies, series, and more, all curated to match your vibe.
        </p>
      </section>

      <footer id="contact" className="footer">
        <p>Contact us at support@flickvibes.com | © 2024 FlickVibes</p>
      </footer>
    </div>
  );
};

export default LandingPage;
