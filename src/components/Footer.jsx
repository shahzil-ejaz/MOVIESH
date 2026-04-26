import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[rgba(255,255,255,0.05)] bg-[var(--color-moviesh-bg)] py-12 px-6 md:px-16 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="MOVIESH Logo" 
              className="w-8 h-8 object-cover rounded-md"
            />
            <span className="text-xl font-bold tracking-tight text-[var(--color-moviesh-text)]">
              MOVIESH
            </span>
          </Link>
          <p className="text-sm text-[var(--color-moviesh-text-muted)] text-center md:text-left max-w-xs">
            Your premium destination for discovering and tracking the latest movies and TV shows.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-16 text-sm text-[var(--color-moviesh-text-muted)]">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h4 className="text-white font-semibold mb-2">Navigation</h4>
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link to="/tv" className="hover:text-white transition-colors">TV Shows</Link>
          </div>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[rgba(255,255,255,0.05)] text-center text-sm text-[var(--color-moviesh-text-muted)]">
        &copy; {new Date().getFullYear()} MOVIESH. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
