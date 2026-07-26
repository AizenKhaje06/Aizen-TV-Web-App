/**
 * Video provider interface and base implementation
 */

import { VideoProvider } from './types';

/**
 * Abstract base class for video providers
 */
export abstract class BaseVideoProvider implements VideoProvider {
  abstract name: string;

  abstract getMovieUrl(tmdbId: number): string;
  abstract getEpisodeUrl(tmdbId: number, season: number, episode: number): string;

  /**
   * Validate if URL is from this provider
   */
  abstract validateUrl(url: string): boolean;

  /**
   * Sanitize TMDB ID to prevent injection
   */
  protected sanitizeId(id: number): number {
    const sanitized = Math.abs(Math.floor(id));
    if (sanitized <= 0 || !Number.isFinite(sanitized)) {
      throw new Error('Invalid TMDB ID');
    }
    return sanitized;
  }

  /**
   * Validate season and episode numbers
   */
  protected validateEpisode(season: number, episode: number): void {
    const s = Math.abs(Math.floor(season));
    const e = Math.abs(Math.floor(episode));

    if (s <= 0 || e <= 0 || !Number.isFinite(s) || !Number.isFinite(e)) {
      throw new Error('Invalid season or episode number');
    }
  }
}

/**
 * Provider registry for managing multiple video sources
 */
export class ProviderRegistry {
  private providers: Map<string, VideoProvider> = new Map();
  private activeProvider: string | null = null;

  /**
   * Register a new provider
   */
  register(provider: VideoProvider): void {
    this.providers.set(provider.name, provider);
    
    // Set as active if it's the first provider
    if (!this.activeProvider) {
      this.activeProvider = provider.name;
    }
  }

  /**
   * Get the active provider
   */
  getActive(): VideoProvider {
    if (!this.activeProvider) {
      throw new Error('No active video provider');
    }

    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Provider ${this.activeProvider} not found`);
    }

    return provider;
  }

  /**
   * Set active provider by name
   */
  setActive(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider ${name} not registered`);
    }
    this.activeProvider = name;
  }

  /**
   * Get provider by name
   */
  get(name: string): VideoProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get all registered providers
   */
  getAll(): VideoProvider[] {
    return Array.from(this.providers.values());
  }
}

// Export singleton instance
export const providerRegistry = new ProviderRegistry();
