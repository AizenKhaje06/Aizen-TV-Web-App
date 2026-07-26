import { MediaType } from '@/types/media.types';

/**
 * Player URL Builder Interface
 */
export interface IPlayerURLBuilder {
  buildMovieURL(tmdbId: number): string;
  buildTVURL(tmdbId: number, season: number, episode: number): string;
  buildURL(tmdbId: number, type: MediaType, season?: number, episode?: number): string;
}

/**
 * Player Configuration Interface
 */
export interface IPlayerConfig {
  baseURL: string;
  autoPlay?: boolean;
  quality?: string;
}
