/**
 * AniList GraphQL API Client
 * https://anilist.gitbook.io/anilist-apiv2-docs/
 */

const ANILIST_API_URL = 'https://graphql.anilist.co';

interface AniListResponse<T> {
  data: T;
}

/**
 * Execute GraphQL query against AniList API
 */
async function query<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.statusText}`);
  }

  const json: AniListResponse<T> = await response.json();
  return json.data;
}

/**
 * Get trending anime
 */
export async function getTrendingAnime(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          averageScore
          season
          seasonYear
          episodes
          format
          status
          description
        }
      }
    }
  `;

  const data = await query<{ Page: { media: any[] } }>(gql, { page, perPage });
  return data.Page.media;
}

/**
 * Get popular anime
 */
export async function getPopularAnime(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          averageScore
          season
          seasonYear
          episodes
          format
          status
          description
        }
      }
    }
  `;

  const data = await query<{ Page: { media: any[] } }>(gql, { page, perPage });
  return data.Page.media;
}

/**
 * Get top rated anime
 */
export async function getTopRatedAnime(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: SCORE_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          averageScore
          season
          seasonYear
          episodes
          format
          status
          description
        }
      }
    }
  `;

  const data = await query<{ Page: { media: any[] } }>(gql, { page, perPage });
  return data.Page.media;
}

/**
 * Get currently airing anime
 */
export async function getCurrentlyAiringAnime(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          averageScore
          season
          seasonYear
          episodes
          format
          status
          description
          nextAiringEpisode {
            episode
            airingAt
          }
        }
      }
    }
  `;

  const data = await query<{ Page: { media: any[] } }>(gql, { page, perPage });
  return data.Page.media;
}

/**
 * Get upcoming anime
 */
export async function getUpcomingAnime(page = 1, perPage = 20) {
  const gql = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          averageScore
          season
          seasonYear
          episodes
          format
          status
          description
        }
      }
    }
  `;

  const data = await query<{ Page: { media: any[] } }>(gql, { page, perPage });
  return data.Page.media;
}

/**
 * Get anime by season
 */
export async function getAnimeByseason(season: string, year: number, page = 1, perPage = 20) {
  const gql = `
    query ($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $year, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          averageScore
          season
          seasonYear
          episodes
          format
          status
          description
        }
      }
    }
  `;

  const data = await query<{ Page: { media: any[] } }>(gql, { season, year, page, perPage });
  return data.Page.media;
}

/**
 * Get anime details with relations
 */
export async function getAnimeDetails(id: number) {
  const gql = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        genres
        averageScore
        season
        seasonYear
        episodes
        duration
        format
        status
        description
        studios {
          nodes {
            name
          }
        }
        streamingEpisodes {
          title
          thumbnail
          url
        }
        trailer {
          id
          site
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        relations {
          edges {
            id
            relationType
            node {
              id
              title {
                romaji
                english
                native
              }
              format
              episodes
              seasonYear
              startDate {
                year
                month
                day
              }
            }
          }
        }
      }
    }
  `;

  const data = await query<{ Media: any }>(gql, { id });
  return data.Media;
}

/**
 * Get multiple anime by IDs (for fetching related anime)
 */
export async function getAnimeByIds(ids: number[]) {
  const gql = `
    query ($ids: [Int]) {
      Page {
        media(id_in: $ids, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          format
          episodes
          seasonYear
          coverImage {
            large
            extraLarge
          }
          startDate {
            year
            month
            day
          }
          relations {
            edges {
              relationType
              node {
                id
                format
              }
            }
          }
        }
      }
    }
  `;

  const data = await query<{ Page: { media: any[] } }>(gql, { ids });
  return data.Page.media;
}

export const anilistClient = {
  getTrendingAnime,
  getPopularAnime,
  getTopRatedAnime,
  getCurrentlyAiringAnime,
  getUpcomingAnime,
  getAnimeByseason,
  getAnimeDetails,
  getAnimeByIds,
};
