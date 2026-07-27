/**
 * CineSrc video provider implementation
 * Provides streaming URLs for movies and TV shows via cinesrc.st
 */

import { BaseVideoProvider } from './providers';

const CINESRC_BASE_URL = 'https://cinesrc.st/embed';

/**
 * CineSrc provider for streaming content
 */
export class CineSrcProvider extends BaseVideoProvider {
  name = 'cinesrc';

  /**
   * Get movie streaming URL
   * Format: https://cinesrc.st/embed/movie/{tmdb_id}
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    return `${CINESRC_BASE_URL}/movie/${sanitizedId}`;
  }

  /**
   * Get TV episode streaming URL
   * Format: https://cinesrc.st/embed/tv/{tmdb_id}?s={season}&e={episode}
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);

    return `${CINESRC_BASE_URL}/tv/${sanitizedId}?s=${season}&e=${episode}`;
  }

  /**
   * Validate if URL is from CineSrc
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'cinesrc.st' && urlObj.pathname.startsWith('/embed');
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const cinesrcProvider = new CineSrcProvider();
