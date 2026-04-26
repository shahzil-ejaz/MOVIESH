import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsSearchExpanded(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'My List', path: '/list' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass px-6 py-4 transition-all duration-300">
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
                <Search className={`text-[var(--color-moviesh-text-muted)] ${isSearchExpanded ? 'mr-2' : ''}`} size={20} />
                {isSearchExpanded && (
                  <input
                    type="text"
                    value={query}
                    autoFocus
                    onBlur={() => !query && setIsSearchExpanded(false)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Movie/Tv Show Title"
                    className="w-full bg-transparent text-sm text-[var(--color-moviesh-text)] placeholder-[var(--color-moviesh-text-muted)] focus:outline-none"
                  />
                )}
              </div>
            </form>

            <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-[rgba(255,255,255,0.1)] hover:border-[var(--color-moviesh-accent)] transition-colors bg-[var(--color-moviesh-card)] flex items-center justify-center">
              <User size={18} className="text-[var(--color-moviesh-text-muted)]" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full z-40 glass border-t border-[rgba(255,255,255,0.1)] flex flex-col py-4 px-6 gap-2 shadow-2xl animate-fade-in">
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
