/**
 * Anime to TMDB Matcher Service
 * Matches AniList anime to TMDB TV shows to get episode thumbnails
 */

import { tmdbClient } from '../tmdb/client';

interface TMDBMatch {
  tmdbId: number;
  name: string;
  year: number | null;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Clean anime title for better matching
 * Removes special characters, season numbers, and extra info
 */
function cleanTitle(title: string): string {
  return title
    .replace(/[:\-\–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/Season \d+/gi, '')
    .replace(/Part \d+/gi, '')
    .replace(/2nd Season/gi, '')
    .replace(/3rd Season/gi, '')
    .replace(/\d+th Season/gi, '')
    .replace(/\(TV\)/gi, '')
    .replace(/\(.*?\)/g, '')
    .trim();
}

/**
 * Calculate match confidence based on title similarity
 */
function calculateConfidence(animeTitle: string, tmdbTitle: string): 'high' | 'medium' | 'low' {
  const cleanAnime = cleanTitle(animeTitle.toLowerCase());
  const cleanTmdb = cleanTitle(tmdbTitle.toLowerCase());

  // Exact match
  if (cleanAnime === cleanTmdb) {
    return 'high';
  }

  // Contains match
  if (cleanAnime.includes(cleanTmdb) || cleanTmdb.includes(cleanAnime)) {
    return 'medium';
  }

  // Word-by-word comparison
  const animeWords = cleanAnime.split(' ').filter(w => w.length > 2);
  const tmdbWords = cleanTmdb.split(' ').filter(w => w.length > 2);
  const matchCount = animeWords.filter(word => tmdbWords.includes(word)).length;

  if (matchCount >= Math.min(animeWords.length, tmdbWords.length) * 0.7) {
    return 'medium';
  }

  return 'low';
}

/**
 * Search TMDB for anime by title
 */
export async function findTMDBMatch(
  animeTitle: string,
  animeYear?: number | null
): Promise<TMDBMatch | null> {
  try {
    // Try with English title first
    const searchTitle = cleanTitle(animeTitle);
    const searchResults = await tmdbClient.searchTV(searchTitle, { page: 1 });

    if (!searchResults.results || searchResults.results.length === 0) {
      return null;
    }

    // Find best match
    let bestMatch: TMDBMatch | null = null;
    let bestConfidence: 'high' | 'medium' | 'low' = 'low';

    for (const show of searchResults.results.slice(0, 5)) {
      const showYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;
      const confidence = calculateConfidence(animeTitle, show.name);

      // Boost confidence if year matches
      let finalConfidence = confidence;
      if (animeYear && showYear && Math.abs(animeYear - showYear) <= 1) {
        if (confidence === 'medium') finalConfidence = 'high';
        if (confidence === 'low') finalConfidence = 'medium';
      }

      // Helper to compare confidence levels
      const confidenceScore = (conf: 'high' | 'medium' | 'low'): number => {
        if (conf === 'high') return 3;
        if (conf === 'medium') return 2;
        return 1;
      };

      // Keep the best match
      if (!bestMatch || confidenceScore(finalConfidence) > confidenceScore(bestConfidence)) {
        bestMatch = {
          tmdbId: show.id,
          name: show.name,
          year: showYear,
          confidence: finalConfidence,
        };
        bestConfidence = finalConfidence;
      }

      // If we found a high confidence match, stop searching
      if (bestConfidence === 'high') {
        break;
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('Error matching anime to TMDB:', error);
    return null;
  }
}

/**
 * Get episode thumbnail from TMDB
 */
export async function getEpisodeThumbnail(
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<string | null> {
  try {
    const seasonDetails = await tmdbClient.getTVSeason(tmdbId, seasonNumber);
    
    if (!seasonDetails.episodes) {
      return null;
    }

    const episode = seasonDetails.episodes.find(
      (ep) => ep.episode_number === episodeNumber
    );

    return episode?.still_path || null;
  } catch (error) {
    console.error('Error fetching episode thumbnail:', error);
    return null;
  }
}

/**
 * Get all episode thumbnails for a season
 */
export async function getSeasonThumbnails(
  tmdbId: number,
  seasonNumber: number
): Promise<Map<number, string>> {
  const thumbnails = new Map<number, string>();

  try {
    const seasonDetails = await tmdbClient.getTVSeason(tmdbId, seasonNumber);

    if (seasonDetails.episodes) {
      for (const episode of seasonDetails.episodes) {
        if (episode.still_path) {
          thumbnails.set(episode.episode_number, episode.still_path);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching season thumbnails:', error);
  }

  return thumbnails;
}

/**
 * Episode details from TMDB
 */
export interface TMDBEpisodeDetails {
  episodeNumber: number;
  name: string;
  airDate: string | null;
  rating: number;
  overview: string;
  stillPath: string | null;
  runtime: number | null;
}

/**
 * Get all episode details for a season (thumbnails + metadata)
 */
export async function getSeasonEpisodes(
  tmdbId: number,
  seasonNumber: number
): Promise<Map<number, TMDBEpisodeDetails>> {
  const episodes = new Map<number, TMDBEpisodeDetails>();

  try {
    const seasonDetails = await tmdbClient.getTVSeason(tmdbId, seasonNumber);

    if (seasonDetails.episodes) {
      for (const episode of seasonDetails.episodes) {
        episodes.set(episode.episode_number, {
          episodeNumber: episode.episode_number,
          name: episode.name || `Episode ${episode.episode_number}`,
          airDate: episode.air_date || null,
          rating: episode.vote_average || 0,
          overview: episode.overview || '',
          stillPath: episode.still_path || null,
          runtime: episode.runtime || null,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching season episodes:', error);
  }

  return episodes;
}

/**
 * Cache for TMDB matches (in-memory, per session)
 */
const tmdbMatchCache = new Map<string, TMDBMatch | null>();

/**
 * Get TMDB match with caching
 */
export async function getCachedTMDBMatch(
  animeTitle: string,
  animeYear?: number | null
): Promise<TMDBMatch | null> {
  const cacheKey = `${animeTitle}-${animeYear || 0}`;

  if (tmdbMatchCache.has(cacheKey)) {
    return tmdbMatchCache.get(cacheKey)!;
  }

  const match = await findTMDBMatch(animeTitle, animeYear);
  tmdbMatchCache.set(cacheKey, match);

  return match;
}
