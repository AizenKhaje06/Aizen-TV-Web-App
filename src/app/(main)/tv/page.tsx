'use client';

import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { AdaptiveContentRow } from '@/components/media/adaptive-content-row';
import { useTrendingTV, usePopularTV, useTopRatedTV } from '@/hooks/tmdb/use-tv';
import { getPosterUrl } from '@/services/tmdb/images';

export default function TVShowsPage() {
  const router = useRouter();

  // Fetch TV show data
  const { data: trendingTV, isLoading: loadingTrending } = useTrendingTV();
  const { data: popularTV, isLoading: loadingPopular } = usePopularTV();
  const { data: topRatedTV, isLoading: loadingTopRated } = useTopRatedTV();

  // Transform TV show data
  const transformTV = (show: any) => ({
    id: show.id,
    title: show.name,
    name: show.name,
    posterPath: getPosterUrl(show.poster_path) || '',
    voteAverage: show.vote_average,
  });

  const handleItemClick = (id: number) => {
    router.push(`/tv/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 space-y-12">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              TV Shows
            </h1>
            <p className="text-gray-400">
              Discover trending, popular, and top-rated TV series
            </p>
          </div>

          {/* TV Show Sections */}
          <div className="space-y-12">
            <AdaptiveContentRow
              title="Trending Now"
              items={trendingTV?.map(transformTV) || []}
              type="tv"
              isLoading={loadingTrending}
              onItemClick={handleItemClick}
            />

            <AdaptiveContentRow
              title="Popular on MyStream"
              items={popularTV?.results?.map(transformTV) || []}
              type="tv"
              isLoading={loadingPopular}
              onItemClick={handleItemClick}
            />

            <AdaptiveContentRow
              title="Top Rated"
              items={topRatedTV?.results?.map(transformTV) || []}
              type="tv"
              isLoading={loadingTopRated}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
