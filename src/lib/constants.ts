export const STORAGE_KEYS = {
  CONTINUE_WATCHING: 'mystream_continue_watching',
  WATCH_HISTORY: 'mystream_watch_history',
  FAVORITES: 'mystream_favorites',
  THEME: 'mystream_theme',
  USER_PREFERENCES: 'mystream_user_preferences',
} as const;

export const QUERY_KEYS = {
  TRENDING_MOVIES: 'trending-movies',
  TRENDING_TV: 'trending-tv',
  POPULAR_MOVIES: 'popular-movies',
  POPULAR_TV: 'popular-tv',
  TOP_RATED_MOVIES: 'top-rated-movies',
  TOP_RATED_TV: 'top-rated-tv',
  UPCOMING_MOVIES: 'upcoming-movies',
  MOVIE_DETAILS: 'movie-details',
  TV_DETAILS: 'tv-details',
  MOVIE_CREDITS: 'movie-credits',
  TV_CREDITS: 'tv-credits',
  MOVIE_RECOMMENDATIONS: 'movie-recommendations',
  TV_RECOMMENDATIONS: 'tv-recommendations',
  MOVIE_SIMILAR: 'movie-similar',
  TV_SIMILAR: 'tv-similar',
  SEARCH_MULTI: 'search-multi',
  TV_SEASON: 'tv-season',
} as const;

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
} as const;

export const GENRES = {
  movie: {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    27: 'Horror',
    10749: 'Romance',
    878: 'Sci-Fi',
  },
  tv: {
    10759: 'Action & Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    27: 'Horror',
    10749: 'Romance',
    10765: 'Sci-Fi & Fantasy',
  },
} as const;

export const TV_NAVIGATION = {
  KEYS: {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    ENTER: 'Enter',
    BACK: 'Escape',
  },
  FOCUS_CLASS: 'tv-focused',
  SCROLL_OFFSET: 100,
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  tv: 1920,
} as const;
