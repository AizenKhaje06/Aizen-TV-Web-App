'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeroBanner } from '@/components/media/hero-banner';
import { ContinueWatchingRow } from '@/components/media/continue-watching-row';
import { TopTenRow } from '@/components/media/top-10-row';
import { StudiosRow } from '@/components/media/studios-row';
import { SimpleMediaCarousel } from '@/components/media/simple-media-carousel';
import { 
  useTrendingMovies, 
  useUpcomingMovies, 
  useMovieImages,
  useMoviesByGenre,
  useMovieDetails
} from '@/hooks/tmdb/use-movies';
import { usePopularTV, useTrendingTV } from '@/hooks/tmdb/use-tv';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';
import { getBackdropUrl, getPosterUrl, getLogoUrl } from '@/services/tmdb/images';
import { ZONES } from '@/lib/navigation/zones';

// TMDB Genre IDs
const GENRE_IDS = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
  HORROR: 27,
  SCI_FI: 878,
  THRILLER: 53,
  ROMANCE: 10749,
  ANIMATION: 16,
  CRIME: 80,
  DOCUMENTARY: 99,
};

export default function HomePage() {
  const router = useRouter();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const padding = useResponsivePadding();

  // Fetch main content
  const { data: trendingMovies } = useTrendingMovies();
  const { data: upcomingData } = useUpcomingMovies();
  const { data: popularTVData } = usePopularTV();
  const { data: trendingTVData } = useTrendingTV();

  // Fetch genre-based content
  const { data: actionMovies } = useMoviesByGenre(GENRE_IDS.ACTION);
  const { data: comedyMovies } = useMoviesByGenre(GENRE_IDS.COMEDY);
  const { data: dramaMovies } = useMoviesByGenre(GENRE_IDS.DRAMA);
  const { data: horrorMovies } = useMoviesByGenre(GENRE_IDS.HORROR);
  const { data: sciFiMovies } = useMoviesByGenre(GENRE_IDS.SCI_FI);
  const { data: thrillerMovies } = useMoviesByGenre(GENRE_IDS.THRILLER);
  const { data: romanceMovies } = useMoviesByGenre(GENRE_IDS.ROMANCE);
  const { data: animationMovies } = useMoviesByGenre(GENRE_IDS.ANIMATION);
  const { data: crimeMovies } = useMoviesByGenre(GENRE_IDS.CRIME);
  const { data: documentaryMovies } = useMoviesByGenre(GENRE_IDS.DOCUMENTARY);

  // Get hero movies (first 5 trending movies)
  const heroMovies = trendingMovies?.slice(0, 5) || [];
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
    ? getLogoUrl(heroImages.logos[0].file_path, 'original') // Use original for high quality
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

  const transformTV = (show: any) => ({
    id: show.id,
    title: show.name,
    name: show.name,
    posterPath: getPosterUrl(show.poster_path) || '',
    voteAverage: show.vote_average,
    releaseDate: show.first_air_date,
    genreIds: show.genre_ids,
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
        <ContinueWatchingRow />

        {/* Trending Right Now Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trending Right Now
            </h2>
          </div>
          <TopTenRow
            items={trendingMovies?.slice(0, 10).map(transformMovie) || []}
            isLoading={false}
            onItemClick={handleItemClick}
          />
        </div>

        {/* Studio & Platforms Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Studio & Platforms
            </h2>
          </div>
          <StudiosRow onStudioClick={(id) => console.log('Studio clicked:', id)} />
        </div>

        {/* New Movies Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              New Movies
            </h2>
          </div>
          <SimpleMediaCarousel
            items={upcomingData?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.NEW_MOVIES}
          />
        </div>

        {/* Popular TV Shows Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Popular TV Shows
            </h2>
          </div>
          <SimpleMediaCarousel
            items={popularTVData?.results?.map(transformTV) || []}
            type="tv"
            onItemClick={(id) => router.push(`/tv/${id}`)}
            zoneId={ZONES.POPULAR_TV}
          />
        </div>

        {/* Action Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Action
            </h2>
          </div>
          <SimpleMediaCarousel
            items={actionMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.ACTION}
          />
        </div>

        {/* Comedy Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Comedy
            </h2>
          </div>
          <SimpleMediaCarousel
            items={comedyMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.COMEDY}
          />
        </div>

        {/* Drama Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Drama
            </h2>
          </div>
          <SimpleMediaCarousel
            items={dramaMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.DRAMA}
          />
        </div>

        {/* Horror Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Horror
            </h2>
          </div>
          <SimpleMediaCarousel
            items={horrorMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.HORROR}
          />
        </div>

        {/* Sci-Fi Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Sci-Fi
            </h2>
          </div>
          <SimpleMediaCarousel
            items={sciFiMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.SCI_FI}
          />
        </div>

        {/* Thriller Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Thriller
            </h2>
          </div>
          <SimpleMediaCarousel
            items={thrillerMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.THRILLER}
          />
        </div>

        {/* Romance Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Romance
            </h2>
          </div>
          <SimpleMediaCarousel
            items={romanceMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.ROMANCE}
          />
        </div>

        {/* Animation Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Animation
            </h2>
          </div>
          <SimpleMediaCarousel
            items={animationMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.ANIMATION}
          />
        </div>

        {/* Crime Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Crime
            </h2>
          </div>
          <SimpleMediaCarousel
            items={crimeMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.CRIME}
          />
        </div>

        {/* Documentary Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Documentary
            </h2>
          </div>
          <SimpleMediaCarousel
            items={documentaryMovies?.results?.map(transformMovie) || []}
            type="movie"
            onItemClick={handleItemClick}
            zoneId={ZONES.DOCUMENTARY}
          />
        </div>

        {/* Trending Anime Section */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trending Anime
            </h2>
          </div>
          <SimpleMediaCarousel
            items={trendingTVData?.filter((show: any) => 
              show.origin_country?.includes('JP') || 
              show.genre_ids?.includes(16)
            ).map(transformTV) || []}
            type="tv"
            onItemClick={(id) => router.push(`/tv/${id}`)}
            zoneId={ZONES.TRENDING_ANIME}
          />
        </div>
      </div>
    </AppShell>
  );
}

