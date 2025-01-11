
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import MoviesPage from "./components/MovieCard.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
