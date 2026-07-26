import { tmdbClient } from './client';
import { SearchResult, MediaListResponse } from '@/types/media.types';
import { PaginationParams } from '@/types/api.types';

/**
 * Search Service
 * High-level service for search operations
 */
export class SearchService {
  /**
   * Search for movies, TV shows, and people
   */
  async searchMulti(query: string, params?: PaginationParams): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    const response = await tmdbClient.searchMulti(query, params);
    return response.results;
  }

  /**
   * Search with pagination
   */
  async searchWithPagination(
    query: string,
    params?: PaginationParams
  ): Promise<MediaListResponse<SearchResult>> {
    if (!query.trim()) {
      return {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      };
    }

    return tmdbClient.searchMulti(query, params);
  }

  /**
   * Filter search results by type
   */
  filterByType(results: SearchResult[], type: 'movie' | 'tv' | 'person'): SearchResult[] {
    return results.filter((result) => result.media_type === type);
  }
}

export const searchService = new SearchService();
