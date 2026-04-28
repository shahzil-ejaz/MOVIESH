import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import ComingSoon from './pages/ComingSoon';
import Discover from './pages/Discover';
import { Analytics } from "@vercel/analytics/react"

function App() {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Standard way to trigger the browser's confirmation dialog
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="app-container min-h-screen text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/:type/:id" element={<MovieDetails />} />
          <Route path="/movies" element={<Discover type="movie" />} />
          <Route path="/tv" element={<Discover type="tv" />} />
          <Route path="/list" element={<ComingSoon />} />
          <Route path="/profile" element={<ComingSoon />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
