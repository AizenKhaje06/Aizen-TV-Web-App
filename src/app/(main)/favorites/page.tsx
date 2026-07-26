'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useHistoryStore } from '@/store/history-store';
import { MediaCard } from '@/components/media/media-card';
import { Heart, History } from 'lucide-react';

export default function FavoritesPage() {
  const history = useHistoryStore((state) => state.history);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 space-y-8">
          {/* Page Header */}
          <div className="flex items-center space-x-3">
            <History className="w-8 h-8 text-primary" />
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Watch History
              </h1>
              <p className="text-gray-400">
                {history.length === 0
                  ? 'No watched items yet'
                  : `${history.length} ${history.length === 1 ? 'item' : 'items'} in your history`}
              </p>
            </div>
          </div>

          {/* History Grid */}
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Heart className="w-20 h-20 text-gray-700" />
              <h2 className="text-2xl font-semibold text-gray-400">
                No watch history yet
              </h2>
              <p className="text-gray-500 text-center max-w-md">
                Start watching movies and TV shows. Your viewing history will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {history.map((item) => (
                <div key={item.id} className="relative group">
                  <MediaCard
                    id={item.mediaId}
                    title={item.title}
                    posterPath={item.posterPath || ''}
                    voteAverage={0}
                    type={item.mediaType}
                  />
                  {/* Progress bar */}
                  {item.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
