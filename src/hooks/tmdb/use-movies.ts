/**
 * React Query hooks for movie data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { moviesService } from '@/services/tmdb/movies.service';
import { QUERY_KEYS } from '@/lib/constants';
import { Movie, MovieDetails, MediaListResponse, Credits } from '@/types/media.types';
import { PaginationParams } from '@/types/api.types';

/**
 * Fetch trending movies
 */
export function useTrendingMovies(): UseQueryResult<Movie[]> {
  return useQuery({
    queryKey: [QUERY_KEYS.TRENDING_MOVIES],
    queryFn: () => moviesService.getTrending(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch popular movies
 */
export function usePopularMovies(params?: PaginationParams): UseQueryResult<MediaListResponse<Movie>> {
  return useQuery({
    queryKey: [QUERY_KEYS.POPULAR_MOVIES, params],
    queryFn: () => moviesService.getPopular(params),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch top rated movies
 */
export function useTopRatedMovies(params?: PaginationParams): UseQueryResult<MediaListResponse<Movie>> {
  return useQuery({
    queryKey: [QUERY_KEYS.TOP_RATED_MOVIES, params],
    queryFn: () => moviesService.getTopRated(params),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch upcoming movies
 */
export function useUpcomingMovies(params?: PaginationParams): UseQueryResult<MediaListResponse<Movie>> {
  return useQuery({
    queryKey: [QUERY_KEYS.UPCOMING_MOVIES, params],
    queryFn: () => moviesService.getUpcoming(params),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch movie details
 */
export function useMovieDetails(movieId: number): UseQueryResult<MovieDetails> {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIE_DETAILS, movieId],
    queryFn: () => moviesService.getDetails(movieId),
    enabled: !!movieId && movieId > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Fetch movie credits
 */
export function useMovieCredits(movieId: number): UseQueryResult<Credits> {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIE_CREDITS, movieId],
    queryFn: () => moviesService.getCredits(movieId),
    enabled: !!movieId && movieId > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Fetch movie recommendations
 */
export function useMovieRecommendations(movieId: number): UseQueryResult<Movie[]> {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIE_RECOMMENDATIONS, movieId],
    queryFn: () => moviesService.getRecommendations(movieId),
    enabled: !!movieId && movieId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch similar movies
 */
export function useSimilarMovies(movieId: number): UseQueryResult<Movie[]> {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIE_SIMILAR, movieId],
    queryFn: () => moviesService.getSimilar(movieId),
    enabled: !!movieId && movieId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch movies by genre
 */
export function useMoviesByGenre(genreId: number, params?: PaginationParams): UseQueryResult<MediaListResponse<Movie>> {
  return useQuery({
    queryKey: ['movies-by-genre', genreId, params],
    queryFn: () => moviesService.getByGenre(genreId, params),
    enabled: !!genreId && genreId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch movie images (logos, backdrops, posters)
 */
export function useMovieImages(movieId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIE_DETAILS, movieId, 'images'],
    queryFn: () => moviesService.getImages(movieId),
    enabled: !!movieId && movieId > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Fetch movie videos (trailers, teasers, clips)
 */
export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIE_DETAILS, movieId, 'videos'],
    queryFn: () => moviesService.getVideos(movieId),
    enabled: !!movieId && movieId > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
