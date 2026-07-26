'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeroBanner } from '@/components/media/hero-banner';
import { SimpleMediaCarousel } from '@/components/media/simple-media-carousel';
import { 
  useTrendingMovies, 
  usePopularMovies, 
  useTopRatedMovies, 
  useUpcomingMovies,
  useMovieImages,
  useMovieDetails
} from '@/hooks/tmdb/use-movies';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';
import { getBackdropUrl, getPosterUrl, getLogoUrl } from '@/services/tmdb/images';
import { ZONES } from '@/lib/navigation/zones';

export default function MoviesPage() {
  const router = useRouter();
  const padding = useResponsivePadding();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fetch main movie data
  const { data: trendingMovies } = useTrendingMovies();
  const { data: popularMovies } = usePopularMovies();
  const { data: topRatedMovies } = useTopRatedMovies();
  const { data: upcomingMovies } = useUpcomingMovies();

  // Get hero movies (first 5 popular movies)
  const heroMovies = popularMovies?.results?.slice(0, 5) || [];
  const heroMovie = heroMovies[currentHeroIndex];

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (heroMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroMovies.length]);

  // Fetch logo for current hero movie
  const { data: heroImages } = useMovieImages(heroMovie?.id || 0);
  const heroLogo = heroImages?.logos?.[0]?.file_path 
    ? getLogoUrl(heroImages.logos[0].file_path, 'original')
    : null;

  // Fetch full details for genres
  const { data: heroDetails } = useMovieDetails(heroMovie?.id || 0);

  const handlePlay = (id?: number) => {
    const mediaId = id || heroMovie?.id;
    router.push(`/watch/movie/${mediaId}`);
  };

  const handleMoreInfo = () => {
    if (heroMovie) {
      router.push(`/movie/${heroMovie.id}`);
    }
  };

  const handleItemClick = (id: number) => {
    router.push(`/movie/${id}`);
  };

  // Transform data for display
  const transformMovie = (movie: any) => ({
    id: movie.id,
    title: movie.title,
    name: movie.title,
    posterPath: getPosterUrl(movie.poster_path) || '',
    voteAverage: movie.vote_average,
    releaseDate: movie.release_date,
    genreIds: movie.genre_ids,
  });

  return (
    <AppShell>
      {/* Hero Section */}
      {heroMovie && (
        <HeroBanner
          title={heroMovie.title}
          overview={heroMovie.overview}
          backdropPath={getBackdropUrl(heroMovie.backdrop_path, 'original') || ''}
          logoPath={heroLogo}
          voteAverage={heroMovie.vote_average}
          releaseDate={heroMovie.release_date}
          genres={heroDetails?.genres?.map((g: any) => g.name) || []}
          onPlay={() => handlePlay()}
          onMoreInfo={handleMoreInfo}
        />
      )}

      {/* Hero Navigation Dots */}
      {heroMovies.length > 1 && (
        <div className="flex justify-center gap-2 -mt-12 mb-4 relative z-20">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentHeroIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 w-6 hover:bg-white/60'
              }`}
              aria-label={`Go to movie ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content Rows */}
      <div className="space-y-8 md:space-y-12 py-8 md:py-12">
        {/* Continue Watching */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Continue Watching
            </h2>
          </div>
          {/* TODO: Add ContinueWatchingRow component */}
          <SimpleMediaCarousel
            items={popularMovies?.results?.slice(0, 8).map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="movies-continue-watching"
          />
        </div>

        {/* Trending Movies */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trending Movies
            </h2>
          </div>
          <SimpleMediaCarousel
            items={trendingMovies?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.TRENDING_MOVIES}
          />
        </div>

        {/* New Releases */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              New Releases
            </h2>
          </div>
          <SimpleMediaCarousel
            items={upcomingMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.UPCOMING_MOVIES}
          />
        </div>

        {/* Recently Added */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Recently Added
            </h2>
          </div>
          <SimpleMediaCarousel
            items={popularMovies?.results?.slice(8, 23).map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="movies-recently-added"
          />
        </div>

        {/* Top Rated Movies */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Top Rated Movies
            </h2>
          </div>
          <SimpleMediaCarousel
            items={topRatedMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.TOP_RATED_MOVIES}
          />
        </div>

        {/* Popular Movies */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Popular Movies
            </h2>
          </div>
          <SimpleMediaCarousel
            items={popularMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="movies-popular"
          />
        </div>

        {/* Recommended For You */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Recommended For You
            </h2>
          </div>
          <SimpleMediaCarousel
            items={trendingMovies?.slice(10, 25).map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="movies-recommended"
          />
        </div>
      </div>
    </AppShell>
  );
}
