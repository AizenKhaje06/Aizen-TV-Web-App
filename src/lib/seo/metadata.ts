/**
 * SEO Metadata Utilities
 * 
 * Generates dynamic, SEO-optimized metadata for pages including:
 * - Page titles and descriptions
 * - Open Graph tags
 * - Twitter cards
 * - Structured data (JSON-LD)
 */

import { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';

export interface MediaMetadataProps {
  title: string;
  overview: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  genres?: string[];
  type: 'movie' | 'tv';
}

/**
 * Generate metadata for movie pages
 */
export function generateMovieMetadata(props: MediaMetadataProps): Metadata {
  const { title, overview, posterPath, releaseDate, voteAverage } = props;
  
  const pageTitle = `${title} - ${siteConfig.name}`;
  const description = overview || `Watch ${title} on ${siteConfig.name}`;
  const images = posterPath ? [posterPath] : undefined;
  
  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      type: 'video.movie',
      images,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images,
    },
    other: {
      'movie:release_date': releaseDate || '',
      'movie:rating': voteAverage?.toString() || '',
    },
  };
}

/**
 * Generate metadata for TV show pages
 */
export function generateTVMetadata(props: MediaMetadataProps): Metadata {
  const { title, overview, posterPath } = props;
  
  const pageTitle = `${title} - ${siteConfig.name}`;
  const description = overview || `Watch ${title} on ${siteConfig.name}`;
  const images = posterPath ? [posterPath] : undefined;
  
  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      type: 'video.tv_show',
      images,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images,
    },
  };
}

/**
 * Generate metadata for search pages
 */
export function generateSearchMetadata(query: string): Metadata {
  return {
    title: `Search: ${query} - ${siteConfig.name}`,
    description: `Search results for "${query}" on ${siteConfig.name}`,
    robots: {
      index: false, // Don't index search result pages
      follow: true,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for movies
 */
export function generateMovieStructuredData(props: MediaMetadataProps) {
  const { title, overview, posterPath, releaseDate, voteAverage, genres } = props;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title,
    description: overview,
    image: posterPath,
    datePublished: releaseDate,
    aggregateRating: voteAverage ? {
      '@type': 'AggregateRating',
      ratingValue: voteAverage,
      bestRating: 10,
    } : undefined,
    genre: genres,
  };
}

/**
 * Generate structured data (JSON-LD) for TV shows
 */
export function generateTVStructuredData(props: MediaMetadataProps) {
  const { title, overview, posterPath, releaseDate, voteAverage, genres } = props;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: title,
    description: overview,
    image: posterPath,
    datePublished: releaseDate,
    aggregateRating: voteAverage ? {
      '@type': 'AggregateRating',
      ratingValue: voteAverage,
      bestRating: 10,
    } : undefined,
    genre: genres,
  };
}

/**
 * Truncate description for meta tags
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
