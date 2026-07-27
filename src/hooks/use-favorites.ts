import { useUserStore } from '@/store/user-store';

export function useFavorites() {
  const favorites = useUserStore((state) => state.favorites);
  const addFavorite = useUserStore((state) => state.addFavorite);
  const removeFavorite = useUserStore((state) => state.removeFavorite);
  const isFavorite = useUserStore((state) => state.isFavorite);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoading: false,
  };
}
