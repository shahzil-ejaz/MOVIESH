import React from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrending, getTopRatedMovies, getActionMovies } from '../services/tmdb';

const Home = () => {
  return (
    <div className="pb-20">
      <Hero />
      <div className="mt-8 md:mt-12 relative z-10">
        <MovieRow title="Trending Now" fetchFn={getTrending} />
        <MovieRow title="Popular & Recommended" fetchFn={getTopRatedMovies} />
        <MovieRow title="New Releases (Action)" fetchFn={getActionMovies} />
      </div>
    </div>
  );
};

export default Home;
