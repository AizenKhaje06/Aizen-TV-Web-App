import { tmdbClient } from './client';
import {
  TVShow,
  TVShowDetails,
  MediaListResponse,
  Credits,
  SeasonDetails,
} from '@/types/media.types';
import { PaginationParams, TVQueryParams } from '@/types/api.types';

/**
 * TV Shows Service
 * High-level service for TV show-related operations
 */
export class TVService {
  /**
   * Get trending TV shows
   */
  async getTrending(): Promise<TVShow[]> {
    const response = await tmdbClient.getTrendingTV('week');
    return response.results;
  }

  /**
   * Get popular TV shows
   */
  async getPopular(params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return tmdbClient.getPopularTV(params);
  }

  /**
   * Get top rated TV shows
   */
  async getTopRated(params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return tmdbClient.getTopRatedTV(params);
  }

  /**
   * Get TV show details by ID
   */
  async getDetails(tvId: number): Promise<TVShowDetails> {
    return tmdbClient.getTVDetails(tvId);
  }

  /**
   * Get TV show credits (cast and crew)
   */
  async getCredits(tvId: number): Promise<Credits> {
    return tmdbClient.getTVCredits(tvId);
  }

  /**
   * Get TV show recommendations
   */
  async getRecommendations(tvId: number): Promise<TVShow[]> {
    const response = await tmdbClient.getTVRecommendations(tvId);
    return response.results;
  }

  /**
   * Get similar TV shows
   */
  async getSimilar(tvId: number): Promise<TVShow[]> {
    const response = await tmdbClient.getSimilarTV(tvId);
    return response.results;
  }

  /**
   * Get TV season details
   */
  async getSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails> {
    return tmdbClient.getTVSeason(tvId, seasonNumber);
  }

  /**
   * Discover TV shows with filters
   */
  async discover(params?: TVQueryParams): Promise<MediaListResponse<TVShow>> {
    return tmdbClient.discoverTV(params);
  }

  /**
   * Get TV shows by genre
   */
  async getByGenre(genreId: number, params?: PaginationParams): Promise<MediaListResponse<TVShow>> {
    return tmdbClient.discoverTV({
      ...params,
      with_genres: genreId.toString(),
    });
  }
}

export const tvService = new TVService();
