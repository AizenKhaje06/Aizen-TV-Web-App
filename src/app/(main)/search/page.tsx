'use client';

import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { SearchBar } from '@/components/layout/search-bar';
import { AdaptiveMediaGrid } from '@/components/media/adaptive-media-grid';
import { SkeletonCard } from '@/components/media/skeleton-card';
import { ApiError } from '@/components/common/api-error';
import { EmptyState } from '@/components/common/empty-state';
import { useMultiSearch } from '@/hooks/tmdb/use-search';
import { getPosterUrl } from '@/services/tmdb/images';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { data: results, isLoading, error, refetch } = useMultiSearch(query);

  // Filter for movies and TV shows only
  const mediaResults = results?.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  ) || [];

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-12 lg:px-16 py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <SearchBar autoFocus={false} />
        </div>

        {/* Results */}
        {query ? (
          <>
            {/* Error State */}
            {error && (
              <ApiError
                error={error as Error}
                message="Failed to search"
                onRetry={() => refetch()}
                showHomeButton={false}
              />
            )}

            {/* Results Header */}
            {!error && (
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  Search Results for &quot;{query}&quot;
                </h1>
                {!isLoading && (
                  <p className="text-gray-400">
                    Found {mediaResults.length} {mediaResults.length === 1 ? 'result' : 'results'}
                  </p>
                )}
              </div>
            )}

            {/* Results Grid */}
            {!error && (
              <>
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : mediaResults.length > 0 ? (
                  <AdaptiveMediaGrid
                    items={mediaResults.map((item) => {
                      const title = item.media_type === 'movie' 
                        ? (item.title || item.original_title)
                        : (item.name || item.original_name);
                      
                      return {
                        id: item.id,
                        title: title || 'Untitled',
                        posterPath: getPosterUrl(item.poster_path) || '',
                        voteAverage: item.vote_average,
                        type: item.media_type as 'movie' | 'tv',
                      };
                    })}
                    gridId="search-results"
                  />
                ) : (
                  <EmptyState
                    icon="search"
                    title="No results found"
                    description="Try searching with different keywords"
                  />
                )}
              </>
            )}
          </>
        ) : (
          <EmptyState
            icon="search"
            title="Search for movies and TV shows"
            description="Enter a title, genre, or keyword above"
          />
        )}
      </div>
    </AppShell>
  );
}
