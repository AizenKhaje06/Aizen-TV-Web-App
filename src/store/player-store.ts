import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  MediaInfo,
  ContinueWatchingItem,
  WatchHistoryItem,
} from '@/types/player.types';
import { STORAGE_KEYS } from '@/lib/constants';

interface PlayerState {
  // Current playback state
  isPlaying: boolean;
  currentMedia: MediaInfo | null;
  progress: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;

  // Continue watching
  continueWatching: ContinueWatchingItem[];

  // Watch history
  watchHistory: WatchHistoryItem[];

  // Actions
  setPlaying: (isPlaying: boolean) => void;
  setCurrentMedia: (media: MediaInfo | null) => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (isMuted: boolean) => void;
  setFullscreen: (isFullscreen: boolean) => void;

  addToContinueWatching: (item: ContinueWatchingItem) => void;
  removeFromContinueWatching: (id: number) => void;
  updateContinueWatching: (id: number, progress: number) => void;
  clearContinueWatching: () => void;

  addToWatchHistory: (item: WatchHistoryItem) => void;
  clearWatchHistory: () => void;

  reset: () => void;
}

const initialState = {
  isPlaying: false,
  currentMedia: null,
  progress: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  continueWatching: [],
  watchHistory: [],
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setPlaying: (isPlaying) => set({ isPlaying }),

        setCurrentMedia: (currentMedia) => set({ currentMedia }),

        setProgress: (progress) => {
          set({ progress });
          
          // Auto-save to continue watching if progress is meaningful
          const { currentMedia } = get();
          if (currentMedia && progress > 0.05 && progress < 0.95) {
            get().updateContinueWatching(currentMedia.id, progress);
          }
        },

        setVolume: (volume) => set({ volume }),

        setMuted: (isMuted) => set({ isMuted }),

        setFullscreen: (isFullscreen) => set({ isFullscreen }),

        addToContinueWatching: (item) =>
          set((state) => {
            const filtered = state.continueWatching.filter((i) => i.id !== item.id);
            return {
              continueWatching: [item, ...filtered].slice(0, 20), // Keep max 20 items
            };
          }),

        removeFromContinueWatching: (id) =>
          set((state) => ({
            continueWatching: state.continueWatching.filter((item) => item.id !== id),
          })),

        updateContinueWatching: (id, progress) =>
          set((state) => {
            const existing = state.continueWatching.find((item) => item.id === id);
            const { currentMedia } = state;

            if (existing) {
              return {
                continueWatching: [
                  { ...existing, progress, lastWatchedAt: Date.now() },
                  ...state.continueWatching.filter((item) => item.id !== id),
                ],
              };
            } else if (currentMedia && currentMedia.id === id) {
              const newItem: ContinueWatchingItem = {
                ...currentMedia,
                progress,
                lastWatchedAt: Date.now(),
              };
              return {
                continueWatching: [newItem, ...state.continueWatching].slice(0, 20),
              };
            }

            return state;
          }),

        clearContinueWatching: () => set({ continueWatching: [] }),

        addToWatchHistory: (item) =>
          set((state) => {
            const filtered = state.watchHistory.filter((i) => i.id !== item.id);
            return {
              watchHistory: [item, ...filtered].slice(0, 50), // Keep max 50 items
            };
          }),

        clearWatchHistory: () => set({ watchHistory: [] }),

        reset: () => set(initialState),
      }),
      {
        name: STORAGE_KEYS.CONTINUE_WATCHING,
        partialize: (state) => ({
          continueWatching: state.continueWatching,
          watchHistory: state.watchHistory,
          volume: state.volume,
          isMuted: state.isMuted,
        }),
      }
    )
  )
);
