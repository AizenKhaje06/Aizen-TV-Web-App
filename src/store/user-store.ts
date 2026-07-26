import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FavoriteItem } from '@/types/player.types';
import { STORAGE_KEYS } from '@/lib/constants';

interface UserState {
  favorites: FavoriteItem[];

  // Actions
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: [],

        addFavorite: (item) =>
          set((state) => {
            const exists = state.favorites.some((fav) => fav.id === item.id);
            if (exists) return state;

            return {
              favorites: [item, ...state.favorites],
            };
          }),

        removeFavorite: (id) =>
          set((state) => ({
            favorites: state.favorites.filter((item) => item.id !== id),
          })),

        isFavorite: (id) => {
          return get().favorites.some((item) => item.id === id);
        },

        clearFavorites: () => set({ favorites: [] }),
      }),
      {
        name: STORAGE_KEYS.FAVORITES,
      }
    )
  )
);
