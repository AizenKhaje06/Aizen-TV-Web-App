import { tmdbClient } from './client';
import {
  Movie,
  MovieDetails,
  MediaListResponse,
  Credits,
} from '@/types/media.types';
import { PaginationParams, MovieQueryParams } from '@/types/api.types';

/**
 * Movies Service
 * High-level service for movie-related operations
 */
export class MoviesService {
  /**
   * Get trending movies
   */
  async getTrending(): Promise<Movie[]> {
    const response = await tmdbClient.getTrendingMovies('week');
    return response.results;
  }

  /**
   * Get popular movies
   */
  async getPopular(params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return tmdbClient.getPopularMovies(params);
  }

  /**
   * Get top rated movies
   */
  async getTopRated(params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return tmdbClient.getTopRatedMovies(params);
  }

  /**
   * Get upcoming movies
   */
  async getUpcoming(params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return tmdbClient.getUpcomingMovies(params);
  }

  /**
   * Get movie details by ID
   */
  async getDetails(movieId: number): Promise<MovieDetails> {
    return tmdbClient.getMovieDetails(movieId);
  }

  /**
   * Get movie credits (cast and crew)
   */
  async getCredits(movieId: number): Promise<Credits> {
    return tmdbClient.getMovieCredits(movieId);
  }

  /**
   * Get movie recommendations
   */
  async getRecommendations(movieId: number): Promise<Movie[]> {
    const response = await tmdbClient.getMovieRecommendations(movieId);
    return response.results;
  }

  /**
   * Get similar movies
   */
  async getSimilar(movieId: number): Promise<Movie[]> {
    const response = await tmdbClient.getSimilarMovies(movieId);
    return response.results;
  }

  /**
   * Discover movies with filters
   */
  async discover(params?: MovieQueryParams): Promise<MediaListResponse<Movie>> {
    return tmdbClient.discoverMovies(params);
  }

  /**
   * Get movies by genre
   */
  async getByGenre(genreId: number, params?: PaginationParams): Promise<MediaListResponse<Movie>> {
    return tmdbClient.discoverMovies({
      ...params,
      with_genres: genreId.toString(),
    });
  }

  /**
   * Get movie images (logos, backdrops, posters)
   */
  async getImages(movieId: number) {
    return tmdbClient.getMovieImages(movieId);
  }
}

export const moviesService = new MoviesService();
