import { MediaType } from './media.types';

export interface PlayerState {
  isPlaying: boolean;
  currentMedia: MediaInfo | null;
  progress: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
}

export interface MediaInfo {
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  duration?: number;
}

export interface WatchHistoryItem extends MediaInfo {
  watchedAt: number;
  progress: number;
  completed: boolean;
}

export interface ContinueWatchingItem extends MediaInfo {
  progress: number;
  lastWatchedAt: number;
}

export interface FavoriteItem {
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  addedAt: number;
}

export interface PlayerConfig {
  autoPlay: boolean;
  autoNext: boolean;
  quality: 'auto' | '720p' | '1080p' | '4k';
  subtitles: boolean;
  subtitleLanguage: string;
}

export type PlayerEvent =
  | 'play'
  | 'pause'
  | 'ended'
  | 'timeupdate'
  | 'volumechange'
  | 'fullscreenchange'
  | 'error';

export interface PlayerEventHandler {
  (event: PlayerEvent, data?: any): void;
}
