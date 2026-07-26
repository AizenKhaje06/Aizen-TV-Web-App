import { axiosClient } from '../api/axios-client';
import {
  Movie,
  MovieDetails,
  TVShow,
  TVShowDetails,
  MediaListResponse,
  Credits,
  SearchResult,
  SeasonDetails,
} from '@/types/media.types';
import { PaginationParams, TimeWindow } from '@/types/api.types';
import { TMDB_ENDPOINTS } from './endpoints';

/**
 * Base TMDB API Client
 * Provides low-level methods for interacting with TMDB API
 */
export class TMDBClient {
  /**
   * Fetch trending movies
   */
  async getTrendingMovies(timeWindow: TimeWindow = 'week', params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.TRENDING_MOVIES(timeWindow), params);
  }

  /**
   * Fetch trending TV shows
   */
  async getTrendingTV(timeWindow: TimeWindow = 'week', params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.TRENDING_TV(timeWindow), params);
  }

  /**
   * Fetch popular movies
   */
  async getPopularMovies(params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.POPULAR_MOVIES, params);
  }

  /**
   * Fetch popular TV shows
   */
  async getPopularTV(params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.POPULAR_TV, params);
  }

  /**
   * Fetch top rated movies
   */
  async getTopRatedMovies(params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.TOP_RATED_MOVIES, params);
  }

  /**
   * Fetch top rated TV shows
   */
  async getTopRatedTV(params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.TOP_RATED_TV, params);
  }

  /**
   * Fetch upcoming movies
   */
  async getUpcomingMovies(params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.UPCOMING_MOVIES, params);
  }

  /**
   * Fetch now playing movies
   */
  async getNowPlayingMovies(params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.NOW_PLAYING_MOVIES, params);
  }

  /**
   * Fetch airing today TV shows
   */
  async getAiringTodayTV(params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.AIRING_TODAY_TV, params);
  }

  /**
   * Fetch movie details
   */
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return axiosClient.get<MovieDetails>(TMDB_ENDPOINTS.MOVIE_DETAILS(movieId));
  }

  /**
   * Fetch TV show details
   */
  async getTVDetails(tvId: number): Promise<TVShowDetails> {
    return axiosClient.get<TVShowDetails>(TMDB_ENDPOINTS.TV_DETAILS(tvId));
  }

  /**
   * Fetch movie credits
   */
  async getMovieCredits(movieId: number): Promise<Credits> {
    return axiosClient.get<Credits>(TMDB_ENDPOINTS.MOVIE_CREDITS(movieId));
  }

  /**
   * Fetch TV show credits
   */
  async getTVCredits(tvId: number): Promise<Credits> {
    return axiosClient.get<Credits>(TMDB_ENDPOINTS.TV_CREDITS(tvId));
  }

  /**
   * Fetch movie recommendations
   */
  async getMovieRecommendations(movieId: number, params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.MOVIE_RECOMMENDATIONS(movieId), params);
  }

  /**
   * Fetch TV show recommendations
   */
  async getTVRecommendations(tvId: number, params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.TV_RECOMMENDATIONS(tvId), params);
  }

  /**
   * Fetch similar movies
   */
  async getSimilarMovies(movieId: number, params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.MOVIE_SIMILAR(movieId), params);
  }

  /**
   * Fetch similar TV shows
   */
  async getSimilarTV(tvId: number, params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.TV_SIMILAR(tvId), params);
  }

  /**
   * Search multi (movies, TV shows, people)
   */
  async searchMulti(query: string, params?: PaginationParams): Promise<MediaListResponse<SearchResult>> {
    return axiosClient.get<MediaListResponse<SearchResult>>(TMDB_ENDPOINTS.SEARCH_MULTI, {
      ...params,
      query,
    });
  }

  /**
   * Search movies
   */
  async searchMovies(query: string, params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.SEARCH_MOVIE, {
      ...params,
      query,
    });
  }

  /**
   * Search TV shows
   */
  async searchTV(query: string, params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.SEARCH_TV, {
      ...params,
      query,
    });
  }

  /**
   * Fetch TV season details
   */
  async getTVSeason(tvId: number, seasonNumber: number): Promise<SeasonDetails> {
    return axiosClient.get<SeasonDetails>(TMDB_ENDPOINTS.TV_SEASON(tvId, seasonNumber));
  }

  /**
   * Discover movies with filters
   */
  async discoverMovies(params?: Record<string, any>): Promise<MediaListResponse<Movie>> {
    return axiosClient.get<MediaListResponse<Movie>>(TMDB_ENDPOINTS.DISCOVER_MOVIE, params);
  }

  /**
   * Discover TV shows with filters
   */
  async discoverTV(params?: Record<string, any>): Promise<MediaListResponse<TVShow>> {
    return axiosClient.get<MediaListResponse<TVShow>>(TMDB_ENDPOINTS.DISCOVER_TV, params);
  }

  /**
   * Fetch movie images (logos, posters, backdrops)
   */
  async getMovieImages(movieId: number): Promise<{
    id: number;
    backdrops: Array<{ file_path: string; width: number; height: number }>;
    logos: Array<{ file_path: string; width: number; height: number }>;
    posters: Array<{ file_path: string; width: number; height: number }>;
  }> {
    return axiosClient.get(TMDB_ENDPOINTS.MOVIE_IMAGES(movieId));
  }

  /**
   * Fetch TV show images (logos, posters, backdrops)
   */
  async getTVImages(tvId: number): Promise<{
    id: number;
    backdrops: Array<{ file_path: string; width: number; height: number }>;
    logos: Array<{ file_path: string; width: number; height: number }>;
    posters: Array<{ file_path: string; width: number; height: number }>;
  }> {
    return axiosClient.get(TMDB_ENDPOINTS.TV_IMAGES(tvId));
  }
}

export const tmdbClient = new TMDBClient();
