import React, { useState, useEffect, useRef } from 'react';
import { getGenres, discoverMedia } from '../services/tmdb';
import GridMovieCard from '../components/GridMovieCard';

const Discover = ({ type }) => {
  const [media, setMedia] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres(type);
        setGenres(data.genres || []);
        setSelectedGenre('');
        setPage(1);
        setMedia([]);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    fetchGenres();
  }, [type]);

  // Fetch Media
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const params = {
          sort_by: 'popularity.desc',
          page: 1,
        };
        if (selectedGenre) {
          params.with_genres = selectedGenre;
        }

        const data = await discoverMedia(type, params);
        setMedia(data.results || []);
        setPage(1);
      } catch (error) {
        console.error("Failed to discover media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [type, selectedGenre]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    try {
      const params = {
        sort_by: 'popularity.desc',
        page: nextPage,
      };
      if (selectedGenre) {
        params.with_genres = selectedGenre;
      }

      const data = await discoverMedia(type, params);
      setMedia(prev => {
        // filter out duplicates just in case
        const existingIds = new Set(prev.map(m => m.id));
        const newMedia = data.results.filter(m => !existingIds.has(m.id));
        return [...prev, ...newMedia];
      });
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more media:", error);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
          Explore {type === 'movie' ? 'Movies' : 'TV Shows'}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Genre Filter */}
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-sm md:text-base font-medium rounded-full flex items-center justify-between py-2.5 pl-6 pr-4 shadow-lg cursor-pointer backdrop-blur-md hover:bg-[rgba(255,255,255,0.1)] transition-colors min-w-[160px]"
            >
              <span>{selectedGenre ? genres.find(g => g.id.toString() === selectedGenre)?.name : 'All Genres'}</span>
              <svg className={`w-4 h-4 ml-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#222831] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                <div 
                  className={`px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm ${selectedGenre === '' ? 'text-[var(--color-moviesh-accent)] font-semibold' : 'text-white'}`}
                  onClick={() => { setSelectedGenre(''); setIsDropdownOpen(false); }}
                >
                  All Genres
                </div>
                {genres.map(g => (
                  <div 
                    key={g.id}
                    className={`px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm border-t border-[rgba(255,255,255,0.02)] ${selectedGenre === g.id.toString() ? 'text-[var(--color-moviesh-accent)] font-semibold' : 'text-white'}`}
                    onClick={() => { setSelectedGenre(g.id.toString()); setIsDropdownOpen(false); }}
                  >
                    {g.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-[var(--color-moviesh-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {media.map((item) => (
              <GridMovieCard key={`${item.id}-${page}`} media={item} type={type} />
            ))}
          </div>

          {media.length > 0 && (
            <div className="flex justify-center mt-12">
              <button 
                onClick={handleLoadMore}
                className="px-8 py-3 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white font-semibold transition-colors shadow-lg"
              >
                Load More
              </button>
            </div>
          )}

          {media.length === 0 && !loading && (
            <div className="text-center text-[var(--color-moviesh-text-muted)] mt-20 text-lg">
              No results found for these filters.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Discover;
