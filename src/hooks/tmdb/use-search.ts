/**
 * React Query hooks for search
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { searchService } from '@/services/tmdb/search.service';
import { QUERY_KEYS } from '@/lib/constants';
import { SearchResult, MediaListResponse } from '@/types/media.types';
import { PaginationParams } from '@/types/api.types';

/**
 * Search for movies, TV shows, and people
 */
export function useMultiSearch(
  query: string,
  params?: PaginationParams
): UseQueryResult<SearchResult[]> {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_MULTI, query, params],
    queryFn: () => searchService.searchMulti(query, params),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Search with pagination
 */
export function useSearchWithPagination(
  query: string,
  params?: PaginationParams
): UseQueryResult<MediaListResponse<SearchResult>> {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_MULTI, 'paginated', query, params],
    queryFn: () => searchService.searchWithPagination(query, params),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
