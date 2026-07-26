/**
 * Watch history store
 * Manages viewing history and continue watching functionality
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WatchHistoryItem } from '@/services/player/types';

interface HistoryState {
  history: WatchHistoryItem[];
  
  // Actions
  addToHistory: (item: Omit<WatchHistoryItem, 'id' | 'timestamp'>) => void;
  updateProgress: (id: string, currentTime: number, duration: number) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getHistoryItem: (mediaId: number, mediaType: 'movie' | 'tv', season?: number, episode?: number) => WatchHistoryItem | undefined;
  getContinueWatching: () => WatchHistoryItem[];
}

/**
 * Generate unique ID for history item
 */
function generateHistoryId(
  mediaId: number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): string {
  if (mediaType === 'tv' && season !== undefined && episode !== undefined) {
    return `tv-${mediaId}-s${season}e${episode}`;
  }
  return `movie-${mediaId}`;
}

/**
 * Calculate progress percentage
 */
function calculateProgress(currentTime: number, duration: number): number {
  if (duration <= 0) return 0;
  return Math.min(Math.round((currentTime / duration) * 100), 100);
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      /**
       * Add or update item in history
       */
      addToHistory: (item) => {
        const id = generateHistoryId(
          item.mediaId,
          item.mediaType,
          item.season,
          item.episode
        );

        const newItem: WatchHistoryItem = {
          ...item,
          id,
          timestamp: Date.now(),
          progress: calculateProgress(item.currentTime, item.duration),
        };

        set((state) => {
          // Remove existing item if present
          const filtered = state.history.filter((h) => h.id !== id);

          // Add new item at the beginning
          return {
            history: [newItem, ...filtered].slice(0, 50), // Keep last 50 items
          };
        });
      },

      /**
       * Update playback progress
       */
      updateProgress: (id, currentTime, duration) => {
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id
              ? {
                  ...item,
                  currentTime,
                  duration,
                  progress: calculateProgress(currentTime, duration),
                  timestamp: Date.now(),
                }
              : item
          ),
        }));
      },

      /**
       * Remove item from history
       */
      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }));
      },

      /**
       * Clear all history
       */
      clearHistory: () => {
        set({ history: [] });
      },

      /**
       * Get specific history item
       */
      getHistoryItem: (mediaId, mediaType, season, episode) => {
        const id = generateHistoryId(mediaId, mediaType, season, episode);
        return get().history.find((item) => item.id === id);
      },

      /**
       * Get continue watching list (items with progress > 5% and < 95%)
       */
      getContinueWatching: () => {
        return get()
          .history.filter((item) => item.progress > 5 && item.progress < 95)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10); // Return top 10
      },
    }),
    {
      name: 'mystream-history',
      version: 1,
    }
  )
);
