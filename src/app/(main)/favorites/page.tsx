'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { SimpleMediaCard } from '@/components/media/simple-media-card';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { useFavorites } from '@/hooks/use-favorites';
import { Film, Tv, Sparkles, ListX } from 'lucide-react';

export default function MyPlaylistPage() {
  const { favorites, isLoading } = useFavorites();
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const filteredFavorites = favorites.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const movieCount = favorites.filter((f) => f.type === 'movie').length;
  const tvCount = favorites.filter((f) => f.type === 'tv').length;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          My Playlist
        </h1>
        <p className="text-gray-400">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your playlist
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-400 hover:bg-surface-light'
            }`}
          >
            <ListX className="w-4 h-4" />
            All ({favorites.length})
          </button>
          <button
            onClick={() => setFilter('movie')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'movie'
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-400 hover:bg-surface-light'
            }`}
          >
            <Film className="w-4 h-4" />
            Movies ({movieCount})
          </button>
          <button
            onClick={() => setFilter('tv')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'tv'
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-400 hover:bg-surface-light'
            }`}
          >
            <Tv className="w-4 h-4" />
            TV & Anime ({tvCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'all'
                ? 'Your playlist is empty'
                : `No ${filter === 'movie' ? 'movies' : 'TV shows & anime'} in your playlist`}
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              {filter === 'all'
                ? 'Start adding your favorite movies, TV shows, and anime to build your personal playlist'
                : `Browse ${filter === 'movie' ? 'movies' : 'TV shows and anime'} and add them to your playlist`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFavorites.map((item, index) => (
              <SimpleMediaCard
                key={`${item.type}-${item.id}`}
                id={item.id}
                title={item.title}
                posterPath={item.posterPath}
                type={item.type}
                zoneId="favorites"
                cardIndex={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </AppShell>
  );
}
