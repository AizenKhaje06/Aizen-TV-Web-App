'use client';

import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { AdaptiveContentRow } from '@/components/media/adaptive-content-row';
import { useTrendingMovies, usePopularMovies, useTopRatedMovies, useUpcomingMovies } from '@/hooks/tmdb/use-movies';
import { getPosterUrl } from '@/services/tmdb/images';

export default function MoviesPage() {
  const router = useRouter();

  // Fetch movie data
  const { data: trendingMovies, isLoading: loadingTrending } = useTrendingMovies();
  const { data: popularMovies, isLoading: loadingPopular } = usePopularMovies();
  const { data: topRatedMovies, isLoading: loadingTopRated } = useTopRatedMovies();
  const { data: upcomingMovies, isLoading: loadingUpcoming } = useUpcomingMovies();

  // Transform movie data
  const transformMovie = (movie: any) => ({
    id: movie.id,
    title: movie.title,
    name: movie.title,
    posterPath: getPosterUrl(movie.poster_path) || '',
    voteAverage: movie.vote_average,
  });

  const handleItemClick = (id: number) => {
    router.push(`/movie/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 space-y-12">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Movies
            </h1>
            <p className="text-gray-400">
              Discover trending, popular, and top-rated movies
            </p>
          </div>

          {/* Movie Sections */}
          <div className="space-y-12">
            <AdaptiveContentRow
              title="Trending Now"
              items={trendingMovies?.map(transformMovie) || []}
              type="movie"
              isLoading={loadingTrending}
              onItemClick={handleItemClick}
            />

            <AdaptiveContentRow
              title="Popular on MyStream"
              items={popularMovies?.results?.map(transformMovie) || []}
              type="movie"
              isLoading={loadingPopular}
              onItemClick={handleItemClick}
            />

            <AdaptiveContentRow
              title="Top Rated"
              items={topRatedMovies?.results?.map(transformMovie) || []}
              type="movie"
              isLoading={loadingTopRated}
              onItemClick={handleItemClick}
            />

            <AdaptiveContentRow
              title="Coming Soon"
              items={upcomingMovies?.results?.map(transformMovie) || []}
              type="movie"
              isLoading={loadingUpcoming}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
