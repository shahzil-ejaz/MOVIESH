import React, { useEffect, useState } from 'react';
import { getTrending } from '../services/tmdb';
import { IMAGE_BASE_URL } from '../utils/constants';
import { Play, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrending();
        // Pick a random movie from top 5 trending or just the first one
        const topMovies = data.results.slice(0, 5);
        const randomMovie = topMovies[Math.floor(Math.random() * topMovies.length)];
        setMovie(randomMovie);
      } catch (error) {
        console.error("Failed to fetch trending for hero:", error);
      }
    };
    fetchTrending();
  }, []);

  if (!movie) return <div className="h-[70vh] w-full bg-[var(--color-moviesh-bg)] animate-pulse"></div>;

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden flex flex-col justify-end px-6 md:px-16 pt-32 pb-8 md:pb-12">
      {/* Background Image with Slow Zoom */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_top] animate-slow-zoom"
        style={{ backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})` }}
      ></div>
      
      {/* Soft Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-moviesh-bg)] via-[var(--color-moviesh-bg)]/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-moviesh-bg)] via-[var(--color-moviesh-bg)]/40 to-transparent"></div>
      
      <div className="relative z-10 max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg text-white tracking-tighter leading-none">
          {movie.title || movie.name || movie.original_name}
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-moviesh-text)] mb-8 drop-shadow-md font-light max-w-[65ch]">
          {truncate(movie.overview, 150)}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/${movie.media_type || 'movie'}/${movie.id}`)}
            className="active-scale flex items-center gap-2 bg-[var(--color-moviesh-accent)] hover:bg-[#c40812] text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-[1.02] shadow-xl shadow-[#e5091440]"
          >
            <Play fill="currentColor" size={20} />
            Play
          </button>
          <button 
            onClick={() => navigate(`/list`)}
            className="active-scale flex items-center gap-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white px-8 py-3 rounded-full font-semibold backdrop-blur-md transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus size={20} />
            Add to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
