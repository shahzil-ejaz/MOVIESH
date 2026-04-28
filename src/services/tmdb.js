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

// UPDATED: Now uses your axios instance and standardizes the params
export const getMoviesByProvider = async (providerId) => {
  const response = await tmdbApi.get('/discover/movie', {
    params: {
      with_watch_providers: providerId,
      watch_region: 'US', // TMDB requires a region when filtering by providers
      sort_by: 'popularity.desc',
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

export const getGenres = async (type = 'movie') => {
  const response = await tmdbApi.get(`/genre/${type}/list`);
  return response.data;
};

export const discoverMedia = async (type = 'movie', params = {}) => {
  const response = await tmdbApi.get(`/discover/${type}`, {
    params: {
      ...params,
    },
  });
  return response.data;
};

export const getTvSeasonDetails = async (tvId, seasonNumber) => {
  const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
  return response.data;
};