/**
 * Anikoto API Client
 * https://anikotoapi.site
 */

const ANIKOTO_API_URL = 'https://anikotoapi.site';

interface AnikotoResponse<T> {
  data: T;
}

/**
 * Fetch from Anikoto API
 */
async function fetchAnikoto<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(endpoint, ANIKOTO_API_URL);
  
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Anikoto API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get recent anime
 */
export async function getRecentAnime(page = 1, perPage = 20) {
  return fetchAnikoto('/recent-anime', { page, per_page: perPage });
}

/**
 * Get anime series details with episodes
 */
export async function getAnimeSeries(id: string | number) {
  return fetchAnikoto(`/series/${id}`);
}

export const anikotoClient = {
  getRecentAnime,
  getAnimeSeries,
};
