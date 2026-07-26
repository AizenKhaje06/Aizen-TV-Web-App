/**
 * React Query hooks for TV show data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { tvService } from '@/services/tmdb/tv.service';
import { QUERY_KEYS } from '@/lib/constants';
import { TVShow, TVShowDetails, MediaListResponse, Credits, SeasonDetails } from '@/types/media.types';
import { PaginationParams } from '@/types/api.types';

/**
 * Fetch trending TV shows
 */
export function useTrendingTV(): UseQueryResult<TVShow[]> {
  return useQuery({
    queryKey: [QUERY_KEYS.TRENDING_TV],
    queryFn: () => tvService.getTrending(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch popular TV shows
 */
export function usePopularTV(params?: PaginationParams): UseQueryResult<MediaListResponse<TVShow>> {
  return useQuery({
    queryKey: [QUERY_KEYS.POPULAR_TV, params],
    queryFn: () => tvService.getPopular(params),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch top rated TV shows
 */
export function useTopRatedTV(params?: PaginationParams): UseQueryResult<MediaListResponse<TVShow>> {
  return useQuery({
    queryKey: [QUERY_KEYS.TOP_RATED_TV, params],
    queryFn: () => tvService.getTopRated(params),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch TV show details
 */
export function useTVDetails(tvId: number): UseQueryResult<TVShowDetails> {
  return useQuery({
    queryKey: [QUERY_KEYS.TV_DETAILS, tvId],
    queryFn: () => tvService.getDetails(tvId),
    enabled: !!tvId && tvId > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Fetch TV show credits
 */
export function useTVCredits(tvId: number): UseQueryResult<Credits> {
  return useQuery({
    queryKey: [QUERY_KEYS.TV_CREDITS, tvId],
    queryFn: () => tvService.getCredits(tvId),
    enabled: !!tvId && tvId > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Fetch TV show recommendations
 */
export function useTVRecommendations(tvId: number): UseQueryResult<TVShow[]> {
  return useQuery({
    queryKey: [QUERY_KEYS.TV_RECOMMENDATIONS, tvId],
    queryFn: () => tvService.getRecommendations(tvId),
    enabled: !!tvId && tvId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch similar TV shows
 */
export function useSimilarTV(tvId: number): UseQueryResult<TVShow[]> {
  return useQuery({
    queryKey: [QUERY_KEYS.TV_SIMILAR, tvId],
    queryFn: () => tvService.getSimilar(tvId),
    enabled: !!tvId && tvId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch TV season details
 */
export function useSeasonDetails(tvId: number, seasonNumber: number): UseQueryResult<SeasonDetails> {
  return useQuery({
    queryKey: [QUERY_KEYS.TV_SEASON, tvId, seasonNumber],
    queryFn: () => tvService.getSeasonDetails(tvId, seasonNumber),
    enabled: !!tvId && tvId > 0 && seasonNumber >= 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Fetch TV shows by genre
 */
export function useTVByGenre(genreId: number, params?: PaginationParams): UseQueryResult<MediaListResponse<TVShow>> {
  return useQuery({
    queryKey: ['tv-by-genre', genreId, params],
    queryFn: () => tvService.getByGenre(genreId, params),
    enabled: !!genreId && genreId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
