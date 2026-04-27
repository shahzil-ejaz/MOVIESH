import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getTvDetails, getTvSeasonDetails } from '../services/tmdb';
import VideoPlayer from '../components/VideoPlayer';
import { IMAGE_BASE_URL } from '../utils/constants';
import { Star, Calendar, Clock, ChevronDown, Play } from 'lucide-react';

const MovieDetails = () => {
  const { type, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // TV Show specific states
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSeasonDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = type === 'tv' ? await getTvDetails(id) : await getMovieDetails(id);
        setMovie(data);
        
        // If it's a TV show, default to the first valid season
        if (type === 'tv' && data.seasons && data.seasons.length > 0) {
          const defaultSeason = data.seasons.find(s => s.season_number > 0)?.season_number || 1;
          setSelectedSeason(defaultSeason);
          setSelectedEpisode(1);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, type]);

  // Fetch episodes when selectedSeason changes
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (type !== 'tv' || !movie) return;
      try {
        const data = await getTvSeasonDetails(id, selectedSeason);
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
    };
    fetchEpisodes();
  }, [id, selectedSeason, type, movie]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-moviesh-accent)] border-t-transparent rounded-full animate-spin mt-20"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 text-center text-xl text-gray-400">
        Movie not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-moviesh-bg)] pb-20">
      {/* Background Poster Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})` }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pt-24">
        {/* Video Player Section */}
        <div className="mb-10 w-full lg:w-3/4 mx-auto">
          <VideoPlayer tmdbId={id} type={type} season={selectedSeason} episode={selectedEpisode} />
        </div>

        {/* TV Show Seasons & Episodes Section */}
        {type === 'tv' && movie?.seasons && (
          <div className="mt-10 mb-10 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">Episodes</h2>
              
              {/* Season Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                  className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-base font-medium rounded-xl flex items-center justify-between py-3 px-6 shadow-lg cursor-pointer backdrop-blur-md hover:bg-[rgba(255,255,255,0.1)] transition-colors min-w-[200px]"
                >
                  <span>Season {selectedSeason}</span>
                  <ChevronDown size={18} className={`ml-3 transition-transform duration-300 ${isSeasonDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isSeasonDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-[#222831] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                    {movie.seasons.filter(s => s.season_number > 0).map(season => (
                      <div 
                        key={season.id}
                        className={`px-6 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm border-b border-[rgba(255,255,255,0.02)] last:border-b-0 ${selectedSeason === season.season_number ? 'text-[var(--color-moviesh-accent)] font-semibold' : 'text-white'}`}
                        onClick={() => { 
                          setSelectedSeason(season.season_number); 
                          setIsSeasonDropdownOpen(false); 
                        }}
                      >
                        Season {season.season_number}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Episodes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {episodes.map(ep => (
                <div 
                  key={ep.id}
                  onClick={() => {
                    setSelectedEpisode(ep.episode_number);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 ${selectedEpisode === ep.episode_number ? 'border-[var(--color-moviesh-accent)] ring-2 ring-[var(--color-moviesh-accent)] ring-opacity-50' : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]'}`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video relative overflow-hidden bg-[#1a1f26]">
                    {ep.still_path ? (
                      <img 
                        src={`${IMAGE_BASE_URL}${ep.still_path}`} 
                        alt={ep.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        No Image
                      </div>
                    )}
                    
                    {/* Hover Play Overlay */}
                    <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${selectedEpisode === ep.episode_number ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl ${selectedEpisode === ep.episode_number ? 'bg-[var(--color-moviesh-accent)] text-white' : 'bg-white text-black'}`}>
                        <Play fill="currentColor" size={20} className="ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-[rgba(255,255,255,0.02)] backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white line-clamp-1 flex-1 pr-4">
                        {ep.episode_number}. {ep.name}
                      </h4>
                      <span className="text-xs text-[var(--color-moviesh-text-muted)] shrink-0 bg-[rgba(255,255,255,0.1)] px-2 py-1 rounded-md">
                        {ep.runtime || '?'} min
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-moviesh-text-muted)] line-clamp-2">
                      {ep.overview || "No overview available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="glass rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 mt-10">
          <div className="w-full md:w-1/3 shrink-0">
            <img 
              src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
              alt={movie.title} 
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
          
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title || movie.name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-6 text-[var(--color-moviesh-text-muted)]">
              <span className="flex items-center gap-2">
                <Star size={18} className="text-yellow-500" fill="currentColor" />
                {movie.vote_average?.toFixed(1)} Rating
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-[var(--color-moviesh-accent)]" />
                {(movie.release_date || movie.first_air_date)?.split('-')[0]}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-[var(--color-moviesh-accent)]" />
                {movie.runtime || (movie.episode_run_time && movie.episode_run_time[0])} min
              </span>
            </div>
            
            <div className="mb-6 flex flex-wrap gap-2">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 rounded-full text-sm font-medium bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.05)]">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-[var(--color-moviesh-text)]">Synopsis</h3>
              <p className="text-[var(--color-moviesh-text-muted)] leading-relaxed text-lg font-light">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
