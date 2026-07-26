/**
 * TMDB API Endpoints
 * Centralized endpoint management for all TMDB API calls
 */

export const TMDB_ENDPOINTS = {
  // Movies
  TRENDING_MOVIES: (timeWindow: 'day' | 'week' = 'week') =>
    `/trending/movie/${timeWindow}`,
  POPULAR_MOVIES: '/movie/popular',
  TOP_RATED_MOVIES: '/movie/top_rated',
  UPCOMING_MOVIES: '/movie/upcoming',
  NOW_PLAYING_MOVIES: '/movie/now_playing',
  MOVIE_DETAILS: (id: number) => `/movie/${id}`,
  MOVIE_CREDITS: (id: number) => `/movie/${id}/credits`,
  MOVIE_RECOMMENDATIONS: (id: number) => `/movie/${id}/recommendations`,
  MOVIE_SIMILAR: (id: number) => `/movie/${id}/similar`,
  MOVIE_VIDEOS: (id: number) => `/movie/${id}/videos`,

  // TV Shows
  TRENDING_TV: (timeWindow: 'day' | 'week' = 'week') =>
    `/trending/tv/${timeWindow}`,
  POPULAR_TV: '/tv/popular',
  TOP_RATED_TV: '/tv/top_rated',
  AIRING_TODAY_TV: '/tv/airing_today',
  ON_THE_AIR_TV: '/tv/on_the_air',
  TV_DETAILS: (id: number) => `/tv/${id}`,
  TV_CREDITS: (id: number) => `/tv/${id}/credits`,
  TV_RECOMMENDATIONS: (id: number) => `/tv/${id}/recommendations`,
  TV_SIMILAR: (id: number) => `/tv/${id}/similar`,
  TV_SEASON: (tvId: number, seasonNumber: number) =>
    `/tv/${tvId}/season/${seasonNumber}`,
  TV_EPISODE: (tvId: number, seasonNumber: number, episodeNumber: number) =>
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`,

  // Search
  SEARCH_MULTI: '/search/multi',
  SEARCH_MOVIE: '/search/movie',
  SEARCH_TV: '/search/tv',

  // Discover
  DISCOVER_MOVIE: '/discover/movie',
  DISCOVER_TV: '/discover/tv',

  // Genres
  MOVIE_GENRES: '/genre/movie/list',
  TV_GENRES: '/genre/tv/list',

  // Images
  MOVIE_IMAGES: (id: number) => `/movie/${id}/images`,
  TV_IMAGES: (id: number) => `/tv/${id}/images`,
} as const;
