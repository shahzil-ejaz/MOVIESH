import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Loader } from 'lucide-react';
import { searchMulti } from '../services/tmdb';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsSearchExpanded(false);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle input change with debounced suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim().length > 0) {
      setIsLoadingSuggestions(true);
      setShowSuggestions(true);
      
      // Debounce API call by 300ms
      debounceTimer.current = setTimeout(async () => {
        try {
          const data = await searchMulti(value);
          // Filter movies/tv with posters, sort by popularity, and limit to 3
          const filtered = data.results
            .filter(item => 
              (item.media_type === 'movie' || item.media_type === 'tv') && 
              item.poster_path &&
              (item.title || item.name)
            )
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 3);
          setSuggestions(filtered);
        } catch (error) {
          console.error("Suggestions search failed:", error);
          setSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const route = suggestion.media_type === 'movie' 
      ? `/movie/${suggestion.id}` 
      : `/tv/${suggestion.id}`;
    
    navigate(route);
    setQuery('');
    setIsSearchExpanded(false);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when input loses focus (Fixed logic)
  const handleInputBlur = () => {
    if (!query) {
      setIsSearchExpanded(false);
    }
    setShowSuggestions(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'My List', path: '/list' },
  ];

  return (
    <>
      {/* 1. UPDATED MAIN NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[rgba(48,71,94,0.4)] backdrop-blur-[16px] border-b border-[rgba(221,221,221,0.05)] px-6 py-4 transition-all duration-300">
        <div className="w-full flex items-center justify-between">
          
          {/* Left Side: Mobile Menu Toggle, Logo & Links */}
          <div className="flex items-center gap-4 md:gap-10">
            <div 
              className="md:hidden cursor-pointer flex items-center justify-center p-1" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </div>

            <Link to="/" className="flex items-center group">
              <span className="text-[22px] md:text-[28px] font-black tracking-tight bg-gradient-to-br from-[var(--color-moviesh-accent)] to-[#ff8400] text-transparent bg-clip-text transition-transform duration-300 group-hover:scale-105">
                MOVIESH
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === link.path ? 'text-white font-semibold' : 'text-[var(--color-moviesh-text-muted)]'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Side: Search & Profile */}
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className={`flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-48 md:w-64 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-2' : 'w-10 h-10 rounded-full justify-center hover:bg-[rgba(255,255,255,0.1)] cursor-pointer'}`}
                   onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}>
                <Search className={`text-[var(--color-moviesh-text-muted)] flex-shrink-0 ${isSearchExpanded ? 'mr-2' : ''}`} size={20} />
                {isSearchExpanded && (
                  <input
                    type="text"
                    value={query}
                    autoFocus
                    onBlur={handleInputBlur}
                    onChange={handleInputChange}
                    placeholder="Movie/Tv Show Title"
                    className="w-full bg-transparent text-sm text-[var(--color-moviesh-text)] placeholder-[var(--color-moviesh-text-muted)] focus:outline-none"
                  />
                )}
              </div>

              {/* Suggestions Dropdown (FIXED EVENT BUBBLING) */}
              {isSearchExpanded && showSuggestions && (
                <div 
                  className="absolute top-full mt-2 w-48 md:w-64 bg-[rgba(48,71,94,0.95)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-2xl overflow-hidden z-50"
                  onMouseDown={(e) => e.preventDefault()} // <-- THIS PREVENTS THE ONBLUR BUG
                >
                  {isLoadingSuggestions ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-3 text-[var(--color-moviesh-text-muted)] text-sm">
                      <Loader size={16} className="animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.id}-${suggestion.media_type}`}
                          onClick={() => handleSuggestionClick(suggestion)} // <-- CHANGED BACK TO ONCLICK
                          className="flex gap-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-colors border-b border-[rgba(255,255,255,0.05)] last:border-b-0 group"
                        >
                          {/* Poster Thumbnail */}
                          <img
                            src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                            alt={suggestion.title || suggestion.name}
                            className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                          />
                          {/* Movie Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-[var(--color-moviesh-accent)] transition-colors">
                              {suggestion.title || suggestion.name}
                            </p>
                            <p className="text-xs text-[var(--color-moviesh-text-muted)]">
                              {suggestion.media_type === 'movie' ? 'Movie' : 'TV Show'} • {new Date(suggestion.release_date || suggestion.first_air_date || '').getFullYear() || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-[var(--color-moviesh-text-muted)] text-sm text-center">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </form>

            <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-[rgba(255,255,255,0.1)] hover:border-[var(--color-moviesh-accent)] transition-colors bg-[var(--color-moviesh-card)] flex items-center justify-center">
              <User size={18} className="text-[var(--color-moviesh-text-muted)]" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. UPDATED MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full z-40 bg-[rgba(48,71,94,0.4)] backdrop-blur-[16px] border border-[rgba(221,221,221,0.05)] border-t-[rgba(255,255,255,0.1)] flex flex-col py-4 px-6 gap-2 shadow-2xl animate-fade-in">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium transition-colors hover:text-white py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0 ${location.pathname === link.path ? 'text-white font-semibold' : 'text-[var(--color-moviesh-text-muted)]'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;