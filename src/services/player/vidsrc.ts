/**
 * MoviesAPI video provider implementation
 * Provides streaming URLs for movies and TV shows via moviesapi.to
 */

import { BaseVideoProvider } from './providers';

const MOVIESAPI_BASE_URL = 'https://moviesapi.to';

/**
 * MoviesAPI provider for streaming content
 */
export class MoviesAPIProvider extends BaseVideoProvider {
  name = 'moviesapi';

  /**
   * Get movie streaming URL
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    return `${MOVIESAPI_BASE_URL}/movie/${sanitizedId}`;
  }

  /**
   * Get TV episode streaming URL
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);

    return `${MOVIESAPI_BASE_URL}/tv/${sanitizedId}/${season}/${episode}`;
  }

  /**
   * Validate if URL is from MoviesAPI
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'moviesapi.to';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const moviesAPIProvider = new MoviesAPIProvider();
