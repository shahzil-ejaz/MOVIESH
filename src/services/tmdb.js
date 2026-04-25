import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_KEY || process.env.REACT_APP_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrending = async () => {
  const response = await tmdbApi.get('/trending/all/day');
  return response.data;
};

export const getTopRatedMovies = async () => {
  const response = await tmdbApi.get('/movie/top_rated');
  return response.data;
};

export const getActionMovies = async () => {
  const response = await tmdbApi.get('/discover/movie', {
    params: {
      with_genres: 28, // Action genre ID
    },
  });
  return response.data;
};

export const searchMulti = async (query) => {
  const response = await tmdbApi.get('/search/multi', {
    params: {
      query,
    },
  });
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}`);
  return response.data;
};

export const getTvDetails = async (id) => {
  const response = await tmdbApi.get(`/tv/${id}`);
  return response.data;
};
