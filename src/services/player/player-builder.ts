/**
 * Player builder for creating video sources
 * - Uses CineSrc for movies (with autoplay and English subtitles)
 * - Uses VidSuper for TV shows/anime episodes (with all features)
 */

import { VideoSource, PlayerConfig, DEFAULT_PLAYER_CONFIG } from './types';
import { providerRegistry } from './providers';
import { cinesrcProvider, vsembedProvider, twoembedProvider, vidsuperProvider } from './vidsrc';

// Register all providers
providerRegistry.register(cinesrcProvider);
providerRegistry.register(vsembedProvider);
providerRegistry.register(twoembedProvider);
providerRegistry.register(vidsuperProvider);

/**
 * Build video source for a movie
 * Uses VidSuper provider with autoplay and features
 */
export function buildMovieSource(
  tmdbId: number,
  title: string
): VideoSource {
  const url = vidsuperProvider.getMovieUrl(tmdbId);

  return {
    url,
    type: 'movie',
    tmdbId,
    title,
  };
}

/**
 * Build video source for a TV episode
 * Uses VidSuper provider with all features
 */
export function buildEpisodeSource(
  tmdbId: number,
  season: number,
  episode: number,
  title: string
): VideoSource {
  const url = vidsuperProvider.getEpisodeUrl(tmdbId, season, episode);

  return {
    url,
    type: 'tv',
    tmdbId,
    season,
    episode,
    title,
  };
}

/**
 * Get player configuration
 */
export function getPlayerConfig(overrides?: Partial<PlayerConfig>): PlayerConfig {
  return {
    ...DEFAULT_PLAYER_CONFIG,
    ...overrides,
  };
}

/**
 * Generate iframe sandbox attributes
 * Balanced security - allows player functionality while restricting dangerous operations
 */
export function getIframeSandbox(): string {
  return [
    'allow-same-origin',
    'allow-scripts',
    'allow-presentation',
    'allow-forms',
    'allow-popups',
    'allow-modals',
  ].join(' ');
}

/**
 * Generate iframe allow attributes
 */
export function getIframeAllow(config: PlayerConfig = DEFAULT_PLAYER_CONFIG): string {
  const features = config.allowedFeatures || DEFAULT_PLAYER_CONFIG.allowedFeatures || [];
  return features.join('; ');
}

/**
 * Validate video source URL
 */
export function validateVideoSource(source: VideoSource): boolean {
  const provider = providerRegistry.getActive();
  return provider.validateUrl(source.url);
}
