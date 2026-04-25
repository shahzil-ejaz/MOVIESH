import React, { useEffect, useState } from 'react';
import { getTrending } from '../services/tmdb';
import { IMAGE_BASE_URL } from '../utils/constants';
import { Play, Info } from 'lucide-react';
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

  if (!movie) return <div className="h-[70vh] w-full bg-[#0a0a0a] animate-pulse"></div>;

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div 
      className="relative h-[70vh] w-full bg-cover bg-[center_top]"
      style={{
        backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-moviesh-bg)] via-[#0a0a0a]/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-moviesh-bg)] via-[#0a0a0a]/40 to-transparent"></div>
      
      <div className="absolute top-32 md:top-40 left-10 md:left-20 max-w-2xl z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg text-white">
          {movie.title || movie.name || movie.original_name}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md">
          {truncate(movie.overview, 150)}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/${movie.media_type || 'movie'}/${movie.id}`)}
            className="flex items-center gap-2 bg-[var(--color-moviesh-accent)] hover:bg-[#2d5c42] text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(58,120,86,0.5)]"
          >
            <Play fill="currentColor" size={20} />
            Play
          </button>
          <button 
            onClick={() => navigate(`/${movie.media_type || 'movie'}/${movie.id}`)}
            className="flex items-center gap-2 bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)] text-white px-8 py-3 rounded-full font-bold backdrop-blur-md transition-all hover:scale-105"
          >
            <Info size={20} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
