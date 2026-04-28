import React, { useState, useRef, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { ChevronDown, ChevronUp } from 'lucide-react';
// Make sure to add getMoviesByProvider to your tmdb.js
import { getTrending, getTopRatedMovies, getMoviesByProvider } from '../services/tmdb';

// Defined OTT platforms with their TMDB Provider IDs and corresponding colors
const PLATFORMS = [
  { id: 8, name: 'Netflix', bgColor: 'bg-[#F05454]', textColor: 'text-white', letter: 'N' },
  { id: 10, name: 'Prime Video', bgColor: 'bg-[#00A8E1]', textColor: 'text-white', letter: 'P' },
  { id: 1899, name: 'Max', bgColor: 'bg-black border border-white/20', textColor: 'text-white', letter: 'M' },
  { id: 337, name: 'Disney+', bgColor: 'bg-[#00146B]', textColor: 'text-white', letter: 'D+' },
  { id: 350, name: 'Apple TV+', bgColor: 'bg-black border border-white/20', textColor: 'text-white', letter: 'tv' },
  { id: 531, name: 'Paramount+', bgColor: 'bg-[#0064FF]', textColor: 'text-white', letter: 'P+' },
  { id: 15, name: 'Hulu', bgColor: 'bg-[#1CE783]', textColor: 'text-black', letter: 'H' },
];

const Home = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch function that triggers MovieRow to reload when a new platform is selected
  const fetchPlatformMovies = useCallback(() => {
    return getMoviesByProvider(selectedPlatform.id);
  }, [selectedPlatform.id]);

  // Our custom Dropdown Header UI exactly like the image
  const PlatformHeader = (
    <div className="relative flex items-center text-2xl font-bold text-white tracking-wide" ref={dropdownRef}>
      <span className="w-1 h-6 bg-[#F05454] mr-3 rounded-sm"></span> 
      <span>Only on </span>
      <div 
        className="ml-2 cursor-pointer flex items-center relative"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="border-b-2 border-[#F05454] pb-0.5">{selectedPlatform.name}</span>
        {isDropdownOpen ? (
          <ChevronUp size={22} className="ml-1 text-[#F05454]" />
        ) : (
          <ChevronDown size={22} className="ml-1 text-[#F05454]" />
        )}
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-[130%] left-0 w-[240px] bg-[rgba(48,71,94,0.7)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-2xl z-[100] overflow-hidden">
            {PLATFORMS.map((p, index) => (
              <div 
                key={p.id} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedPlatform(p); 
                  setIsDropdownOpen(false); 
                }} 
                className={`flex items-center px-4 py-3 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer border-b border-[rgba(255,255,255,0.05)] ${index === PLATFORMS.length - 1 ? 'last:border-b-0' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold mr-4 ${p.bgColor} ${p.textColor}`}>
                  {p.letter}
                </div>
                <span className="text-[14px] font-medium text-white/90">{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      <Hero />
      <div className="mt-8 md:mt-12 relative z-10">
        <MovieRow title="Trending Now" fetchFn={getTrending} />
        <MovieRow title="Popular & Recommended" fetchFn={getTopRatedMovies} />
        
        {/* Replaced Action Movies with the dynamic Platform Row */}
        <MovieRow title={PlatformHeader} fetchFn={fetchPlatformMovies} />
      </div>
    </div>
  );
};

export default Home;