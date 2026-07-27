/**
 * Video provider implementations
 * - CineSrc for movies
 * - VSEmbed for TV shows and anime episodes (primary)
 * - VidSuper for TV shows and anime episodes (alternative)
 * - 2Embed for TV shows and anime episodes (alternative)
 * - MoviesAPI + Vidora for alternative (requires API call)
 */

import { BaseVideoProvider } from './providers';

const CINESRC_BASE_URL = 'https://cinesrc.st/embed';
const VSEMBED_BASE_URL = 'https://vsembed.ru/embed';
const VIDSUPER_BASE_URL = 'https://vidsuper.net';
const TWOEMBED_BASE_URL = 'https://www.2embed.online';
const MOVIESAPI_BASE_URL = 'https://moviesapi.to';

/**
 * CineSrc provider for movies
 * Includes autoplay and English subtitles by default
 */
export class CineSrcProvider extends BaseVideoProvider {
  name = 'cinesrc';

  /**
   * Get movie streaming URL with autoplay, English subtitles, and quality preference
   * Format: https://cinesrc.st/embed/movie/{tmdb_id}?autoplay=1&sub=en&quality=1080p
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    return `${CINESRC_BASE_URL}/movie/${sanitizedId}?autoplay=1&sub=en&quality=1080p`;
  }

  /**
   * Get TV episode streaming URL - Not used
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);
    return `${CINESRC_BASE_URL}/tv/${sanitizedId}?s=${season}&e=${episode}&autoplay=1&sub=en&quality=1080p`;
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

/**
 * VSEmbed provider for TV shows and anime episodes
 * Simple and clean format
 */
export class VSEmbedProvider extends BaseVideoProvider {
  name = 'vsembed';

  /**
   * Get movie streaming URL - Not used
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    return `${VSEMBED_BASE_URL}/movie/${sanitizedId}`;
  }

  /**
   * Get TV episode streaming URL
   * Format: https://vsembed.ru/embed/tv/{tmdb_id}/{season}-{episode}
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);

    return `${VSEMBED_BASE_URL}/tv/${sanitizedId}/${season}-${episode}`;
  }

  /**
   * Validate if URL is from VSEmbed
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'vsembed.ru';
    } catch {
      return false;
    }
  }
}

/**
 * 2Embed provider for TV shows and anime episodes
 * Simple and reliable alternative
 */
export class TwoEmbedProvider extends BaseVideoProvider {
  name = '2embed';

  /**
   * Get movie streaming URL - Not used
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    return `${TWOEMBED_BASE_URL}/embed/${sanitizedId}`;
  }

  /**
   * Get TV episode streaming URL
   * Format: https://www.2embed.online/tv-2embed.php?id={tmdb_id}&season={season}&episode={episode}
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);

    return `${TWOEMBED_BASE_URL}/tv-2embed.php?id=${sanitizedId}&season=${season}&episode=${episode}`;
  }

  /**
   * Validate if URL is from 2Embed
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'www.2embed.online' || urlObj.hostname === '2embed.online';
    } catch {
      return false;
    }
  }
}

/**
 * VidSuper provider for TV shows and anime episodes
 * Includes autoplay, episode selector, skip intro, and more
 */
export class VidSuperProvider extends BaseVideoProvider {
  name = 'vidsuper';

  /**
   * Get movie streaming URL with features
   * Format: https://vidsuper.net/movie/{tmdb_id}?autoplay=true&overlay=true&color=8B5CF6&subtitle_delay=1
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    
    const params = new URLSearchParams({
      autoplay: 'true',
      overlay: 'true',
      color: '8B5CF6',
      subtitle_delay: '1'
    });

    return `${VIDSUPER_BASE_URL}/movie/${sanitizedId}?${params.toString()}`;
  }

  /**
   * Get TV episode streaming URL with all features enabled
   * Includes 1 second subtitle delay for better sync
   * Format: https://vidsuper.net/tv/{tmdb_id}/{season}/{episode}?autoplay=true&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&skip_intro=true&color=8B5CF6&subtitle_delay=1
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);

    const params = new URLSearchParams({
      autoplay: 'true',
      nextEpisode: 'true',
      autoplayNextEpisode: 'true',
      episodeSelector: 'true',
      overlay: 'true',
      skip_intro: 'true',
      color: '8B5CF6',
      subtitle_delay: '1'  // Default 1 second delay for better sync
    });

    return `${VIDSUPER_BASE_URL}/tv/${sanitizedId}/${season}/${episode}?${params.toString()}`;
  }

  /**
   * Validate if URL is from VidSuper
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'vidsuper.net';
    } catch {
      return false;
    }
  }
}

/**
 * MoviesAPI provider that fetches Vidora embed URL via API
 * Requires API call to get actual video URL
 */
export class MoviesAPIVidoraProvider extends BaseVideoProvider {
  name = 'moviesapi-vidora';

  /**
   * Get movie streaming URL - Not used
   */
  getMovieUrl(tmdbId: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    return `${MOVIESAPI_BASE_URL}/movie/${sanitizedId}`;
  }

  /**
   * Get TV episode streaming URL
   * Returns MoviesAPI endpoint that needs to be fetched for Vidora URL
   * Format: https://moviesapi.to/api/v1/tv/{tmdb_id}/{season}/{episode}
   */
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string {
    const sanitizedId = this.sanitizeId(tmdbId);
    this.validateEpisode(season, episode);

    // Return API endpoint - needs to be fetched in player component
    return `${MOVIESAPI_BASE_URL}/api/v1/tv/${sanitizedId}/${season}/${episode}`;
  }

  /**
   * Fetch Vidora embed URL from MoviesAPI
   * This should be called in the player component
   */
  async fetchVidoraUrl(tmdbId: number, season: number, episode: number): Promise<string | null> {
    try {
      const apiUrl = this.getEpisodeUrl(tmdbId, season, episode);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
      // Find Vidora server in response
      const vidoraServer = data.servers?.find((server: any) => 
        server.name === 'Vidora' || server.name.toLowerCase().includes('vidora')
      );

      return vidoraServer?.embedUrl || null;
    } catch (error) {
      console.error('Failed to fetch Vidora URL:', error);
      return null;
    }
  }

  /**
   * Validate if URL is from MoviesAPI or Vidora
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'moviesapi.to' || urlObj.hostname === 'vidora.stream';
    } catch {
      return false;
    }
  }
}

// Export singleton instances
export const cinesrcProvider = new CineSrcProvider();
export const vsembedProvider = new VSEmbedProvider();
export const twoembedProvider = new TwoEmbedProvider();
export const vidsuperProvider = new VidSuperProvider();
export const moviesapiVidoraProvider = new MoviesAPIVidoraProvider();
