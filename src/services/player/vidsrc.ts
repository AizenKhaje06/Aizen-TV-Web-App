/**
 * VidSrc video provider implementation
 * Provides streaming URLs for movies and TV shows
 */

import { BaseVideoProvider } from './providers';

const VIDSRC_BASE_URL = 'https://vidsrc.sbs/embed';

/**
 * VidSrc provider for streaming content
 */
export class VidSrcProvider extends BaseVideoProvider {
  name = 'vidsrc';

  /**
   * Get movie streaming URL
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    return `${VIDSRC_BASE_URL}/movie/${sanitizedId}`;
  }

  /**
   * Get TV episode streaming URL
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);

    return `${VIDSRC_BASE_URL}/tv/${sanitizedId}/${season}/${episode}`;
  }

  /**
   * Validate if URL is from VidSrc
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const validDomains = [
        'vidsrc2.ru',
        'vidsrcme.ru',
        'vidsrcme.su',
        'vidsrc-me.ru',
        'vidsrc-me.su',
        'vidsrc-embed.ru',
        'vidsrc-embed.su',
        'vsrc.su'
      ];
      return validDomains.includes(urlObj.hostname) && urlObj.pathname.startsWith('/embed');
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const vidSrcProvider = new VidSrcProvider();
