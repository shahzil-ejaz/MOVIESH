import React from 'react';
import { POSTER_BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';

const GridMovieCard = ({ media, type }) => {
  const navigate = useNavigate();
  const mediaType = media.media_type || type || 'movie';

  if (!media.poster_path) return null;

  return (
    <div className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/${mediaType}/${media.id}`)}>
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <img 
          src={`${POSTER_BASE_URL}${media.poster_path}`} 
          alt={media.title || media.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Minimalist Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          <button 
            className="w-12 h-12 rounded-full bg-[var(--color-moviesh-accent)] hover:bg-[#d94b4b] flex items-center justify-center shadow-xl transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${mediaType}/${media.id}`);
            }}
          >
            <Play fill="currentColor" size={20} className="text-white" />
          </button>
          <button 
            className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] hover:bg-white hover:text-black flex items-center justify-center shadow-xl transition-all hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/list');
            }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="px-1 mt-1">
        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1">
          {media.title || media.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[var(--color-moviesh-text-muted)]">
            {(media.release_date || media.first_air_date)?.split('-')[0]}
          </span>
          <span className="text-xs font-medium text-[var(--color-moviesh-accent)]">
            {media.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GridMovieCard;
