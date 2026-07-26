export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

export interface TVShowDetails extends TVShow {
  created_by: Creator[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode | null;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  episode_count: number;
  poster_path: string | null;
  season_number: number;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface MediaListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity: number;
}
