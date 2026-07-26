import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/constants';

type Theme = 'dark' | 'light' | 'system';
type Quality = 'auto' | '720p' | '1080p' | '4k';
type AnimationLevel = 'low' | 'medium' | 'high';
type TextSize = 'normal' | 'large' | 'x-large';

interface UserPreferences {
  autoPlay: boolean;
  autoNext: boolean;
  quality: Quality;
  subtitles: boolean;
  subtitleLanguage: string;
}

interface TVSettings {
  // Display
  animationIntensity: AnimationLevel;
  focusScale: number; // 1.0 - 1.2
  textSize: TextSize;

  // Behavior
  autoplayPreviews: boolean;
  focusSound: boolean;
  
  // Accessibility
  highContrastMode: boolean;
  reducedMotion: boolean;
  showFocusOutline: boolean;
}

interface SettingsState {
  theme: Theme;
  preferences: UserPreferences;
  isTVMode: boolean;
  tvSettings: TVSettings;

  // Actions
  setTheme: (theme: Theme) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setTVMode: (isTVMode: boolean) => void;
  setTVSettings: (settings: Partial<TVSettings>) => void;
  resetPreferences: () => void;
  resetTVSettings: () => void;
}

const defaultPreferences: UserPreferences = {
  autoPlay: true,
  autoNext: true,
  quality: 'auto',
  subtitles: false,
  subtitleLanguage: 'en',
};

const defaultTVSettings: TVSettings = {
  animationIntensity: 'medium',
  focusScale: 1.1,
  textSize: 'normal',
  autoplayPreviews: false,
  focusSound: false,
  highContrastMode: false,
  reducedMotion: false,
  showFocusOutline: true,
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark',
        preferences: defaultPreferences,
        isTVMode: false,
        tvSettings: defaultTVSettings,

        setTheme: (theme) => set({ theme }),

        setPreferences: (newPreferences) =>
          set((state) => ({
            preferences: { ...state.preferences, ...newPreferences },
          })),

        setTVMode: (isTVMode) => set({ isTVMode }),

        setTVSettings: (newSettings) =>
          set((state) => ({
            tvSettings: { ...state.tvSettings, ...newSettings },
          })),

        resetPreferences: () => set({ preferences: defaultPreferences }),

        resetTVSettings: () => set({ tvSettings: defaultTVSettings }),
      }),
      {
        name: STORAGE_KEYS.USER_PREFERENCES,
      }
    )
  )
);
