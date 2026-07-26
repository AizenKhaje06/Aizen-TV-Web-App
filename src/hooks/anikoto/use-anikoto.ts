/**
 * React Query hooks for Anikoto anime data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { anikotoClient } from '@/services/anikoto/client';

/**
 * Fetch recent anime
 */
export function useRecentAnime(page = 1, perPage = 20): UseQueryResult<any> {
  return useQuery({
    queryKey: ['anikoto-recent', page, perPage],
    queryFn: () => anikotoClient.getRecentAnime(page, perPage),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch anime series details with episodes
 */
export function useAnimeSeries(id: string | number): UseQueryResult<any> {
  return useQuery({
    queryKey: ['anikoto-series', id],
    queryFn: () => anikotoClient.getAnimeSeries(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
