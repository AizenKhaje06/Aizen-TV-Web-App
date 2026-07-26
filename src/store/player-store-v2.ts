/**
 * Enhanced Player state management store
 * Manages video player state and controls for Phase 4
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerStateV2 {
  // Playback state
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;

  // UI state
  isFullscreen: boolean;
  showControls: boolean;

  // Content state
  currentMediaId: number | null;
  currentMediaType: 'movie' | 'tv' | null;
  currentSeason: number | null;
  currentEpisode: number | null;
  currentTitle: string | null;

  // Preferences (persisted)
  autoplay: boolean;
  autoplayNextEpisode: boolean;
  volume: number;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => void;
  setShowControls: (show: boolean) => void;
  setCurrentMedia: (
    id: number,
    type: 'movie' | 'tv',
    title: string,
    season?: number,
    episode?: number
  ) => void;
  setAutoplay: (autoplay: boolean) => void;
  setAutoplayNextEpisode: (autoplay: boolean) => void;
  reset: () => void;
}

const initialState = {
  isPlaying: false,
  isPaused: true,
  isMuted: false,
  isLoading: false,
  hasError: false,
  errorMessage: null,
  isFullscreen: false,
  showControls: true,
  currentMediaId: null,
  currentMediaType: null,
  currentSeason: null,
  currentEpisode: null,
  currentTitle: null,
};

export const usePlayerStoreV2 = create<PlayerStateV2>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,
      autoplay: true,
      autoplayNextEpisode: true,
      volume: 1,

      // Actions - using get() instead of state parameter to avoid closure issues
      play: () => set({ isPlaying: true, isPaused: false }),
      pause: () => set({ isPlaying: false, isPaused: true }),
      togglePlay: () => {
        const { isPlaying, isPaused } = get();
        set({ isPlaying: !isPlaying, isPaused: !isPaused });
      },
      setMuted: (muted) => set({ isMuted: muted }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ hasError: !!error, errorMessage: error }),
      setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
      toggleFullscreen: () => {
        const { isFullscreen } = get();
        set({ isFullscreen: !isFullscreen });
      },
      setShowControls: (show) => set({ showControls: show }),
      setCurrentMedia: (id, type, title, season, episode) =>
        set({
          currentMediaId: id,
          currentMediaType: type,
          currentTitle: title,
          currentSeason: season || null,
          currentEpisode: episode || null,
          hasError: false,
          errorMessage: null,
        }),
      setAutoplay: (autoplay) => set({ autoplay }),
      setAutoplayNextEpisode: (autoplay) => set({ autoplayNextEpisode: autoplay }),
      reset: () => set(initialState),
    }),
    {
      name: 'mystream-player-v2',
      version: 1,
      partialize: (state) => ({
        autoplay: state.autoplay,
        autoplayNextEpisode: state.autoplayNextEpisode,
        volume: state.volume,
        isMuted: state.isMuted,
      }),
    }
  )
);
