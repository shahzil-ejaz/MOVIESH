import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film } from 'lucide-react';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-[var(--color-moviesh-accent)] p-2 rounded-xl shadow-[0_0_15px_rgba(58,120,86,0.5)] group-hover:scale-110 transition-transform duration-300">
            <Film size={24} className="text-white" />
          </div>
          <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-[var(--color-moviesh-accent)] to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            MOVIESH
          </span>
        </Link>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-md ml-8">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, tv shows..."
              className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-moviesh-accent)] focus:ring-1 focus:ring-[var(--color-moviesh-accent)] transition-all"
            />
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
