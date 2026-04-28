import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieRow = ({ title, fetchFn }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const rowRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFn();
        setMovies(data.results || []);
      } catch (error) {
        console.error(`Failed to fetch movies for row:`, error);
        setMovies([]); // Ensure it's an array on fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchFn]);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling || movies.length === 0 || !rowRef.current) return;

    const autoScroll = () => {
      if (rowRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          rowRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          rowRef.current.scrollLeft += 0.5;
        }
      }
    };

    autoScrollIntervalRef.current = setInterval(autoScroll, 50);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, movies.length]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10 px-6 md:px-10">
      {/* Header/Dropdown always stays visible */}
      <div className="mb-4 relative z-50">
        {typeof title === 'string' ? (
          <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
        ) : (
          title
        )}
      </div>
      
      {/* Loading State */}
      {loading ? (
        <div className="flex gap-4 overflow-x-hidden py-4 h-[250px] items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : movies.length === 0 ? (
        /* Empty State */
        <div className="py-10 text-gray-500 text-center">
          No movies found for this platform.
        </div>
      ) : (
        /* Movie List */
        <div 
          className="relative group"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 h-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronLeft size={32} />
          </button>
          
          <div 
            ref={rowRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 h-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieRow;