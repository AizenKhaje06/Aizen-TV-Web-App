import { IPlayerURLBuilder, IPlayerConfig } from './player.interface';
import { MediaType } from '@/types/media.types';
import { env } from '@/config/env';

/**
 * Video Player URL Builder
 * Constructs embed URLs for the video player
 */
export class PlayerURLBuilder implements IPlayerURLBuilder {
  private baseURL: string;

  constructor(config?: IPlayerConfig) {
    this.baseURL = config?.baseURL || env.NEXT_PUBLIC_PLAYER_BASE_URL;
  }

  /**
   * Build movie embed URL
   * Format: https://vidsrc.sbs/embed/movie/{tmdb_id}
   */
  buildMovieURL(tmdbId: number): string {
    return `${this.baseURL}/movie/${tmdbId}`;
  }

  /**
   * Build TV show embed URL
   * Format: https://vidsrc.sbs/embed/tv/{tmdb_id}/{season}/{episode}
   */
  buildTVURL(tmdbId: number, season: number, episode: number): string {
    return `${this.baseURL}/tv/${tmdbId}/${season}/${episode}`;
  }

  /**
   * Build URL based on media type
   */
  buildURL(tmdbId: number, type: MediaType, season?: number, episode?: number): string {
    if (type === 'movie') {
      return this.buildMovieURL(tmdbId);
    }

    if (type === 'tv' && season !== undefined && episode !== undefined) {
      return this.buildTVURL(tmdbId, season, episode);
    }

    throw new Error('Invalid media type or missing season/episode for TV show');
  }
}

export const playerURLBuilder = new PlayerURLBuilder();
