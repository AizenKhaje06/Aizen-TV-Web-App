/**
 * Anime Season Grouping Service
 * Groups related anime entries into seasons, movies, OVAs, etc.
 */

import { anilistClient } from './client';

export interface GroupedAnime {
  seasons: SeasonGroup[];
  movies: AnimeEntry[];
  ovas: AnimeEntry[];
  onas: AnimeEntry[];
  specials: AnimeEntry[];
}

export interface SeasonGroup {
  seasonNumber: number;
  anime: AnimeEntry;
  episodeCount: number;
}

export interface AnimeEntry {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  format: string;
  episodes: number | null;
  seasonYear: number | null;
  coverImage: {
    large: string;
    extraLarge: string;
  };
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
}

/**
 * Recursively fetch all related anime (PREQUEL, SEQUEL, etc.)
 */
async function fetchAllRelated(
  startId: number,
  visited: Set<number> = new Set()
): Promise<Map<number, any>> {
  if (visited.has(startId)) {
    return new Map();
  }

  visited.add(startId);
  const animeMap = new Map<number, any>();

  try {
    const anime = await anilistClient.getAnimeDetails(startId);
    animeMap.set(startId, anime);

    // Get all PREQUEL and SEQUEL relations
    const relations = anime.relations?.edges || [];
    const relatedIds: number[] = [];

    for (const edge of relations) {
      const relationType = edge.relationType;
      const nodeId = edge.node?.id;

      if (
        nodeId &&
        !visited.has(nodeId) &&
        (relationType === 'PREQUEL' || relationType === 'SEQUEL')
      ) {
        relatedIds.push(nodeId);
      }
    }

    // Recursively fetch related anime
    for (const relatedId of relatedIds) {
      const relatedMap = await fetchAllRelated(relatedId, visited);
      relatedMap.forEach((value, key) => animeMap.set(key, value));
    }
  } catch (error) {
    console.error(`Error fetching anime ${startId}:`, error);
  }

  return animeMap;
}

/**
 * Sort anime entries by release date
 */
function sortByReleaseDate(entries: AnimeEntry[]): AnimeEntry[] {
  return entries.sort((a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;

    if (!dateA.year && !dateB.year) return 0;
    if (!dateA.year) return 1;
    if (!dateB.year) return -1;

    if (dateA.year !== dateB.year) return dateA.year - dateB.year;
    if (dateA.month !== dateB.month) return (dateA.month || 0) - (dateB.month || 0);
    return (dateA.day || 0) - (dateB.day || 0);
  });
}

/**
 * Group anime by format
 */
export async function groupAnimeBySeasons(animeId: number): Promise<GroupedAnime> {
  // Fetch all related anime
  const animeMap = await fetchAllRelated(animeId);
  const allAnime = Array.from(animeMap.values());

  // Separate by format
  const tvSeries: AnimeEntry[] = [];
  const movies: AnimeEntry[] = [];
  const ovas: AnimeEntry[] = [];
  const onas: AnimeEntry[] = [];
  const specials: AnimeEntry[] = [];

  for (const anime of allAnime) {
    const entry: AnimeEntry = {
      id: anime.id,
      title: anime.title,
      format: anime.format,
      episodes: anime.episodes,
      seasonYear: anime.seasonYear,
      coverImage: anime.coverImage,
      startDate: anime.startDate || { year: null, month: null, day: null },
    };

    switch (anime.format) {
      case 'TV':
        tvSeries.push(entry);
        break;
      case 'MOVIE':
        movies.push(entry);
        break;
      case 'OVA':
        ovas.push(entry);
        break;
      case 'ONA':
        onas.push(entry);
        break;
      case 'SPECIAL':
        specials.push(entry);
        break;
      default:
        // Default TV series for unknown formats
        tvSeries.push(entry);
    }
  }

  // Sort each category by release date
  const sortedTvSeries = sortByReleaseDate(tvSeries);
  const sortedMovies = sortByReleaseDate(movies);
  const sortedOvas = sortByReleaseDate(ovas);
  const sortedOnas = sortByReleaseDate(onas);
  const sortedSpecials = sortByReleaseDate(specials);

  // Create season groups for TV series
  const seasons: SeasonGroup[] = sortedTvSeries.map((anime, index) => ({
    seasonNumber: index + 1,
    anime,
    episodeCount: anime.episodes || 0,
  }));

  // If no seasons found, create Season 1 with the original anime
  if (seasons.length === 0) {
    const originalAnime = animeMap.get(animeId);
    if (originalAnime && originalAnime.format === 'TV') {
      seasons.push({
        seasonNumber: 1,
        anime: {
          id: originalAnime.id,
          title: originalAnime.title,
          format: originalAnime.format,
          episodes: originalAnime.episodes,
          seasonYear: originalAnime.seasonYear,
          coverImage: originalAnime.coverImage,
          startDate: originalAnime.startDate || { year: null, month: null, day: null },
        },
        episodeCount: originalAnime.episodes || 0,
      });
    }
  }

  return {
    seasons,
    movies: sortedMovies,
    ovas: sortedOvas,
    onas: sortedOnas,
    specials: sortedSpecials,
  };
}
