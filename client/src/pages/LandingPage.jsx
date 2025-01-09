import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="navbar" role="banner">
        <div className="logo">FlickVibes</div>
        <nav role="navigation" aria-label="Main Navigation">
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <h1>Welcome to FlickVibes</h1>
          <p>Discover, explore, and vibe with your favorite movies and shows.</p>
          <button className="cta-button" aria-label="Get Started with FlickVibes">Get Started</button>
        </section>

        <section id="features" className="features-section" aria-labelledby="features-heading">
          <h2 id="features-heading">Our Features</h2>
          <div className="features-grid">
            <div className="feature-card" role="region" aria-labelledby="feature1-title">
              <h3 id="feature1-title">Personalized Recommendations</h3>
              <p>Discover movies and shows tailored just for you.</p>
            </div>
            <div className="feature-card" role="region" aria-labelledby="feature2-title">
              <h3 id="feature2-title">Trending Now</h3>
              <p>Stay updated with the latest blockbusters and hits.</p>
            </div>
            <div className="feature-card" role="region" aria-labelledby="feature3-title">
              <h3 id="feature3-title">Stream Anywhere</h3>
              <p>Access your favorite content anytime, anywhere.</p>
            </div>
          </div>
        </section>

        <section id="about" className="about-section" aria-labelledby="about-heading">
          <h2 id="about-heading">About Us</h2>
          <p>
            FlickVibes is your ultimate destination for discovering and enjoying the best in entertainment. Dive into a world of movies, series, and more, all curated to match your vibe.
          </p>
        </section>
      </main>

      <footer id="contact" className="footer" role="contentinfo">
        <p>Contact us at support@flickvibes.com | © 2024 FlickVibes</p>
      </footer>
    </div>
  );
};

export default LandingPage;
