import React from 'react';
import { POSTER_BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie.poster_path) return null;

  return (
    <div 
      className="relative min-w-[160px] md:min-w-[200px] h-[240px] md:h-[300px] rounded-xl overflow-hidden cursor-pointer group shrink-0 shadow-lg transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-[0_0_20px_rgba(58,120,86,0.3)]"
      onClick={() => navigate(`/${movie.media_type || 'movie'}/${movie.id}`)}
    >
      <img 
        src={`${POSTER_BASE_URL}${movie.poster_path}`} 
        alt={movie.title || movie.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-2">
          {movie.title || movie.name}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-moviesh-accent)] flex items-center justify-center">
            <Play fill="currentColor" size={14} className="text-white ml-0.5" />
          </div>
          <span className="text-xs text-gray-300 font-semibold">
            {movie.vote_average?.toFixed(1)} / 10
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
