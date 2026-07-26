/**
 * TMDB Image Utilities
 * Helper functions for constructing TMDB image URLs
 */

import { env } from '@/config/env';

const TMDB_IMAGE_BASE = env.NEXT_PUBLIC_TMDB_IMAGE_URL;

// Image size configurations
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
  logo: {
    small: 'w45',
    medium: 'w92',
    large: 'w185',
    original: 'original',
  },
} as const;

// Type definitions
export type PosterSize = keyof typeof IMAGE_SIZES.poster;
export type BackdropSize = keyof typeof IMAGE_SIZES.backdrop;
export type ProfileSize = keyof typeof IMAGE_SIZES.profile;
export type LogoSize = keyof typeof IMAGE_SIZES.logo;

/**
 * Get poster image URL
 */
export function getPosterUrl(
  path: string | null | undefined,
  size: PosterSize = 'medium'
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${IMAGE_SIZES.poster[size]}${path}`;
}

/**
 * Get backdrop image URL
 */
export function getBackdropUrl(
  path: string | null | undefined,
  size: BackdropSize = 'large'
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${IMAGE_SIZES.backdrop[size]}${path}`;
}

/**
 * Get profile image URL
 */
export function getProfileUrl(
  path: string | null | undefined,
  size: ProfileSize = 'medium'
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${IMAGE_SIZES.profile[size]}${path}`;
}

/**
 * Get logo image URL
 */
export function getLogoUrl(
  path: string | null | undefined,
  size: LogoSize = 'medium'
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${IMAGE_SIZES.logo[size]}${path}`;
}

/**
 * Get responsive poster URLs for Next.js Image srcSet
 */
export function getResponsivePosterUrls(
  path: string | null | undefined
): string | null {
  if (!path) return null;

  const sizes: PosterSize[] = ['small', 'medium', 'large'];
  return sizes
    .map((size) => `${getPosterUrl(path, size)} ${IMAGE_SIZES.poster[size]}w`)
    .join(', ');
}

/**
 * Get placeholder image for missing posters/backdrops
 */
export function getPlaceholderImage(type: 'poster' | 'backdrop' | 'profile'): string {
  const placeholders = {
    poster: '/images/placeholder-poster.png',
    backdrop: '/images/placeholder-backdrop.png',
    profile: '/images/placeholder-profile.png',
  };
  
  return placeholders[type];
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(
  path: string | null | undefined,
  type: 'poster' | 'backdrop' | 'profile',
  size: PosterSize | BackdropSize | ProfileSize = 'medium'
): string {
  let url: string | null = null;

  switch (type) {
    case 'poster':
      url = getPosterUrl(path, size as PosterSize);
      break;
    case 'backdrop':
      url = getBackdropUrl(path, size as BackdropSize);
      break;
    case 'profile':
      url = getProfileUrl(path, size as ProfileSize);
      break;
  }

  return url || getPlaceholderImage(type);
}
