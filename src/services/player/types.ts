/**
 * Player service types and interfaces
 */

export interface VideoProvider {
  name: string;
  getMovieUrl(tmdbId: number): string;
  getEpisodeUrl(tmdbId: number, season: number, episode: number): string;
  validateUrl(url: string): boolean;
}

export interface PlayerConfig {
  autoplay?: boolean;
  allowFullscreen?: boolean;
  allowedFeatures?: string[];
}

export interface VideoSource {
  url: string;
  type: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
  title: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
}

export interface EpisodeInfo {
  season: number;
  episode: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number;
  episode_number: number;
  season_number: number;
}

export interface WatchHistoryItem {
  id: string; // unique id for history item
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  season?: number;
  episode?: number;
  episodeName?: string;
  progress: number; // 0-100
  timestamp: number; // last watched timestamp
  duration: number; // total duration in seconds
  currentTime: number; // current playback time in seconds
}

export const DEFAULT_PLAYER_CONFIG: PlayerConfig = {
  autoplay: true,
  allowFullscreen: true,
  allowedFeatures: [
    'accelerometer',
    'autoplay',
    'clipboard-write',
    'encrypted-media',
    'gyroscope',
    'picture-in-picture',
    'fullscreen',
  ],
};
