import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Home } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="glass p-12 rounded-3xl flex flex-col items-center max-w-lg text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-moviesh-accent)] to-transparent opacity-50"></div>
        <Clock size={64} className="text-[var(--color-moviesh-accent)] mb-6 opacity-80" />
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-moviesh-text)] tracking-tight">Coming Soon</h1>
        <p className="text-[var(--color-moviesh-text-muted)] mb-10 text-lg leading-relaxed">
          We're working hard to bring you this feature. It will be beautifully crafted and available in an upcoming update.
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-2 px-8 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-colors rounded-full font-medium"
        >
          <Home size={18} />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
