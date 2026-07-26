'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeroBanner } from '@/components/media/hero-banner';
import { SimpleMediaCarousel } from '@/components/media/simple-media-carousel';
import { 
  useMoviesByGenre,
  useMovieImages,
  useMovieDetails
} from '@/hooks/tmdb/use-movies';
import { useTrendingTV } from '@/hooks/tmdb/use-tv';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';
import { getBackdropUrl, getPosterUrl, getLogoUrl } from '@/services/tmdb/images';

// TMDB Genre IDs for Family/Kids content
const GENRE_IDS = {
  ANIMATION: 16,
  FAMILY: 10751,
};

export default function KidsPage() {
  const router = useRouter();
  const padding = useResponsivePadding();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fetch family-friendly content
  const { data: animationMovies } = useMoviesByGenre(GENRE_IDS.ANIMATION);
  const { data: familyMovies } = useMoviesByGenre(GENRE_IDS.FAMILY);
  const { data: trendingTV } = useTrendingTV();

  // Filter for kids TV shows (animation and family genres)
  const kidsTV = trendingTV?.filter((show: any) => 
    show.genre_ids?.includes(16) || show.genre_ids?.includes(10751) || show.genre_ids?.includes(10762)
  ) || [];

  // Get hero movies (first 5 family movies)
  const heroMovies = familyMovies?.results?.slice(0, 5) || [];
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

  const handleItemClick = (id: number, type: 'movie' | 'tv' = 'movie') => {
    if (type === 'tv') {
      router.push(`/tv/${id}`);
    } else {
      router.push(`/movie/${id}`);
    }
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

  const transformTV = (show: any) => ({
    id: show.id,
    title: show.name,
    name: show.name,
    posterPath: getPosterUrl(show.poster_path) || '',
    voteAverage: show.vote_average,
    releaseDate: show.first_air_date,
    genreIds: show.genre_ids,
  });

  // Filter animations by rating for age-appropriate content
  const allAgesAnimation = animationMovies?.results?.filter((movie: any) => 
    movie.vote_average >= 6.5
  ) || [];

  const classicAnimation = animationMovies?.results?.filter((movie: any) => 
    new Date(movie.release_date).getFullYear() < 2010 && movie.vote_average >= 7
  ) || [];

  const recentAnimation = animationMovies?.results?.filter((movie: any) => 
    new Date(movie.release_date).getFullYear() >= 2015
  ) || [];

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
        {/* Family Movies */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Family Movies
            </h2>
          </div>
          <SimpleMediaCarousel
            items={familyMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="kids-family"
          />
        </div>

        {/* Animated Movies */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Animated Movies
            </h2>
          </div>
          <SimpleMediaCarousel
            items={allAgesAnimation.map(transformMovie)}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="kids-animation"
          />
        </div>

        {/* Recent Animation */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              New Animated Movies
            </h2>
          </div>
          <SimpleMediaCarousel
            items={recentAnimation.map(transformMovie)}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="kids-recent"
          />
        </div>

        {/* Classic Animation */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Classic Animation
            </h2>
          </div>
          <SimpleMediaCarousel
            items={classicAnimation.map(transformMovie)}
            type="movie"
            onItemClick={handleItemClick}
            zoneId="kids-classic"
          />
        </div>

        {/* Kids TV Shows */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Kids TV Shows
            </h2>
          </div>
          <SimpleMediaCarousel
            items={kidsTV.map(transformTV)}
            type="tv"
            onItemClick={(id) => handleItemClick(id, 'tv')}
            zoneId="kids-tv"
          />
        </div>
      </div>
    </AppShell>
  );
}
