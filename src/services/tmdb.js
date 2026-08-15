import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const isV4Token = API_KEY && API_KEY.length > 50;

const config = {
  baseURL: BASE_URL,
};

if (isV4Token) {
  config.headers = {
    Authorization: `Bearer ${API_KEY}`
  };
} else {
  config.params = {
    api_key: API_KEY,
  };
}

const tmdb = axios.create(config);

export const requests = {
  // Home
  fetchTrending: `/trending/all/week?language=en-US`,
  fetchNetflixOriginals: `/discover/tv?with_networks=213`,
  fetchTopRated: `/movie/top_rated?language=en-US`,
  fetchActionMovies: `/discover/movie?with_genres=28`,
  fetchComedyMovies: `/discover/movie?with_genres=35`,
  fetchHorrorMovies: `/discover/movie?with_genres=27`,
  fetchRomanceMovies: `/discover/movie?with_genres=10749`,
  fetchDocumentaries: `/discover/movie?with_genres=99`,

  // TV Shows
  fetchTrendingTv: `/trending/tv/week?language=en-US`,
  fetchPopularTv: `/tv/popular?language=en-US`,
  fetchTopRatedTv: `/tv/top_rated?language=en-US`,
  fetchActionTv: `/discover/tv?with_genres=10759`,
  fetchComedyTv: `/discover/tv?with_genres=35`,
  fetchDramaTv: `/discover/tv?with_genres=18`,
  fetchMysteryTv: `/discover/tv?with_genres=9648`,

  // Movies
  fetchTrendingMovies: `/trending/movie/week?language=en-US`,
  fetchPopularMovies: `/movie/popular?language=en-US`,
  fetchSciFiMovies: `/discover/movie?with_genres=878`,
  fetchThrillerMovies: `/discover/movie?with_genres=53`,
  fetchAnimationMovies: `/discover/movie?with_genres=16`,

  // New & Popular
  fetchNowPlaying: `/movie/now_playing?language=en-US`,
  fetchUpcoming: `/movie/upcoming?language=en-US`,
  fetchAiringToday: `/tv/airing_today?language=en-US`,
  fetchOnTheAir: `/tv/on_the_air?language=en-US`,
};

export default tmdb;
