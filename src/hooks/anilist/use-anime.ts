/**
 * React Query hooks for AniList anime data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { anilistClient } from '@/services/anilist/client';
import { groupAnimeBySeasons, GroupedAnime } from '@/services/anilist/anime-seasons';

/**
 * Fetch trending anime
 */
export function useTrendingAnime(page = 1, perPage = 20): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['anilist-trending', page, perPage],
    queryFn: () => anilistClient.getTrendingAnime(page, perPage),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch popular anime
 */
export function usePopularAnime(page = 1, perPage = 20): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['anilist-popular', page, perPage],
    queryFn: () => anilistClient.getPopularAnime(page, perPage),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch top rated anime
 */
export function useTopRatedAnime(page = 1, perPage = 20): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['anilist-top-rated', page, perPage],
    queryFn: () => anilistClient.getTopRatedAnime(page, perPage),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch currently airing anime
 */
export function useCurrentlyAiringAnime(page = 1, perPage = 20): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['anilist-airing', page, perPage],
    queryFn: () => anilistClient.getCurrentlyAiringAnime(page, perPage),
    staleTime: 1000 * 60 * 5, // 5 minutes (more frequent updates for airing)
  });
}

/**
 * Fetch upcoming anime
 */
export function useUpcomingAnime(page = 1, perPage = 20): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['anilist-upcoming', page, perPage],
    queryFn: () => anilistClient.getUpcomingAnime(page, perPage),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch anime by season
 */
export function useAnimeByseason(season: string, year: number, page = 1, perPage = 20): UseQueryResult<any[]> {
  return useQuery({
    queryKey: ['anilist-season', season, year, page, perPage],
    queryFn: () => anilistClient.getAnimeByseason(season, year, page, perPage),
    enabled: !!season && !!year,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch anime details
 */
export function useAnimeDetails(id: number): UseQueryResult<any> {
  return useQuery({
    queryKey: ['anilist-details', id],
    queryFn: () => anilistClient.getAnimeDetails(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Fetch grouped anime (seasons, movies, OVAs, etc.)
 */
export function useGroupedAnime(id: number): UseQueryResult<GroupedAnime> {
  return useQuery({
    queryKey: ['anilist-grouped', id],
    queryFn: () => groupAnimeBySeasons(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (cache for performance)
  });
}
