/**
 * Player builder for creating video sources
 */

import { VideoSource, PlayerConfig, DEFAULT_PLAYER_CONFIG } from './types';
import { providerRegistry } from './providers';
import { cinesrcProvider } from './vidsrc';

// Register CineSrc as default provider
providerRegistry.register(cinesrcProvider);

/**
 * Build video source for a movie
 */
export function buildMovieSource(
  tmdbId: number,
  title: string
): VideoSource {
  const provider = providerRegistry.getActive();
  const url = provider.getMovieUrl(tmdbId);

  return {
    url,
    type: 'movie',
    tmdbId,
    title,
  };
}

/**
 * Build video source for a TV episode
 */
export function buildEpisodeSource(
  tmdbId: number,
  season: number,
  episode: number,
  title: string
): VideoSource {
  const provider = providerRegistry.getActive();
  const url = provider.getEpisodeUrl(tmdbId, season, episode);

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
 */
export function getIframeSandbox(): string {
  return [
    'allow-same-origin',
    'allow-scripts',
    'allow-presentation',
    'allow-forms',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
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
