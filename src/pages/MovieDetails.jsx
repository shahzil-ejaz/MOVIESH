import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getTvDetails } from '../services/tmdb';
import VideoPlayer from '../components/VideoPlayer';
import { IMAGE_BASE_URL } from '../utils/constants';
import { Star, Calendar, Clock } from 'lucide-react';

const MovieDetails = () => {
  const { type, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = type === 'tv' ? await getTvDetails(id) : await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

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
          <VideoPlayer tmdbId={id} type={type} />
        </div>

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
            
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
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
              <h3 className="text-xl font-semibold mb-3 text-white">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
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
