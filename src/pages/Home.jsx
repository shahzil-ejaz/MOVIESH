import React from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrending, getTopRatedMovies, getActionMovies } from '../services/tmdb';

const Home = () => {
  return (
    <div className="pb-20">
      <Hero />
      <div className="mt-4 md:mt-8 relative z-10">
        <MovieRow title="Trending Now" fetchFn={getTrending} />
        <MovieRow title="Top Rated" fetchFn={getTopRatedMovies} />
        <MovieRow title="Action Movies" fetchFn={getActionMovies} />
      </div>
    </div>
  );
};

export default Home;
