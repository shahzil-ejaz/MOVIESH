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
import { StatusBar } from '@capacitor/status-bar';

function App() {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Standard way to trigger the browser's confirmation dialog
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
// Listen for when the iframe goes into fullscreen
  useEffect(() => {
    // Hide status bar immediately on mount so app looks like a game
    const hideStatusBar = async () => {
      try {
        await StatusBar.hide();
      } catch (err) {
        // Not running in native app
      }
    };
    hideStatusBar();

    const handleFullscreen = async () => {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        // 1. Force phone into landscape
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock("landscape").catch((err) => console.log(err));
        }
      } else {
        // Exited fullscreen! Unlock rotation
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
    };

    // Attach listeners
    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("webkitfullscreenchange", handleFullscreen);

    // Cleanup function so React doesn't duplicate them
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("webkitfullscreenchange", handleFullscreen);
    };
  }, []); // <--- The empty brackets mean this only runs ONCE.
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
