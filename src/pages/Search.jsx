import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchMulti(query);
        // Filter out people, only keep movies and tv shows with posters
        const filtered = data.results.filter(
          item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
        );
        setResults(filtered);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  return (
    <div className="min-h-screen pt-24 px-6 md:px-10">
      <h2 className="text-3xl font-bold mb-8 text-white">
        Search Results for <span className="text-[var(--color-moviesh-accent)]">"{query}"</span>
      </h2>
      
      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-[var(--color-moviesh-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-400 text-xl">
          We couldn't find any movies matching '{query}'.
        </div>
      )}
    </div>
  );
};

export default Search;
