'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeroBanner } from '@/components/media/hero-banner';
import { SimpleMediaCarousel } from '@/components/media/simple-media-carousel';
import { 
  useTrendingTV, 
  usePopularTV, 
  useTopRatedTV,
  useTVImages,
  useTVDetails
} from '@/hooks/tmdb/use-tv';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';
import { getBackdropUrl, getPosterUrl, getLogoUrl } from '@/services/tmdb/images';

export default function TVShowsPage() {
  const router = useRouter();
  const padding = useResponsivePadding();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fetch TV show data
  const { data: trendingTV } = useTrendingTV();
  const { data: popularTV } = usePopularTV();
  const { data: topRatedTV } = useTopRatedTV();

  // Get hero TV shows (first 5 popular shows)
  const heroShows = popularTV?.results?.slice(0, 5) || [];
  const heroShow = heroShows[currentHeroIndex];

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (heroShows.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroShows.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroShows.length]);

  // Fetch logo for current hero show
  const { data: heroImages } = useTVImages(heroShow?.id || 0);
  const heroLogo = heroImages?.logos?.[0]?.file_path 
    ? getLogoUrl(heroImages.logos[0].file_path, 'original')
    : null;

  // Fetch full details for genres
  const { data: heroDetails } = useTVDetails(heroShow?.id || 0);

  const handlePlay = (id?: number) => {
    const mediaId = id || heroShow?.id;
    if (heroShow || id) {
      // Navigate to first episode of first season
      router.push(`/watch/tv/${mediaId}/1/1`);
    }
  };

  const handleMoreInfo = () => {
    if (heroShow) {
      router.push(`/tv/${heroShow.id}`);
    }
  };

  const handleItemClick = (id: number) => {
    router.push(`/tv/${id}`);
  };

  // Transform data for display
  const transformTV = (show: any) => ({
    id: show.id,
    title: show.name,
    name: show.name,
    posterPath: getPosterUrl(show.poster_path) || '',
    voteAverage: show.vote_average,
    releaseDate: show.first_air_date,
    genreIds: show.genre_ids,
  });

  // Filter shows by genre/category
  const actionTV = trendingTV?.filter((show: any) => 
    show.genre_ids?.includes(10759) // Action & Adventure
  ) || [];

  const comedyTV = trendingTV?.filter((show: any) => 
    show.genre_ids?.includes(35) // Comedy
  ) || [];

  const dramaTV = trendingTV?.filter((show: any) => 
    show.genre_ids?.includes(18) // Drama
  ) || [];

  const sciFiTV = trendingTV?.filter((show: any) => 
    show.genre_ids?.includes(10765) // Sci-Fi & Fantasy
  ) || [];

  const crimeTV = trendingTV?.filter((show: any) => 
    show.genre_ids?.includes(80) // Crime
  ) || [];

  const documentaryTV = topRatedTV?.results?.filter((show: any) => 
    show.genre_ids?.includes(99) // Documentary
  ) || [];

  const animeTV = trendingTV?.filter((show: any) => 
    show.origin_country?.includes('JP') || show.genre_ids?.includes(16)
  ) || [];

  return (
    <AppShell>
      {/* Hero Section */}
      {heroShow && (
        <HeroBanner
          title={heroShow.name}
          overview={heroShow.overview}
          backdropPath={getBackdropUrl(heroShow.backdrop_path, 'original') || ''}
          logoPath={heroLogo}
          voteAverage={heroShow.vote_average}
          releaseDate={heroShow.first_air_date}
          genres={heroDetails?.genres?.map((g: any) => g.name) || []}
          onPlay={() => handlePlay()}
          onMoreInfo={handleMoreInfo}
        />
      )}

      {/* Hero Navigation Dots */}
      {heroShows.length > 1 && (
        <div className="flex justify-center gap-2 -mt-12 mb-4 relative z-20">
          {heroShows.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentHeroIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 w-6 hover:bg-white/60'
              }`}
              aria-label={`Go to show ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content Rows */}
      <div className="space-y-8 md:space-y-12 py-8 md:py-12">
        {/* Trending TV Shows */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trending TV Shows
            </h2>
          </div>
          <SimpleMediaCarousel
            items={trendingTV?.map(transformTV) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-trending"
          />
        </div>

        {/* Top Rated TV Shows */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Top Rated TV Shows
            </h2>
          </div>
          <SimpleMediaCarousel
            items={topRatedTV?.results?.map(transformTV) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-top-rated"
          />
        </div>

        {/* Action & Adventure */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Action & Adventure
            </h2>
          </div>
          <SimpleMediaCarousel
            items={actionTV.map(transformTV)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-action"
          />
        </div>

        {/* Comedy Shows */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Comedy Shows
            </h2>
          </div>
          <SimpleMediaCarousel
            items={comedyTV.map(transformTV)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-comedy"
          />
        </div>

        {/* Drama Series */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Drama Series
            </h2>
          </div>
          <SimpleMediaCarousel
            items={dramaTV.map(transformTV)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-drama"
          />
        </div>

        {/* Sci-Fi & Fantasy */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Sci-Fi & Fantasy
            </h2>
          </div>
          <SimpleMediaCarousel
            items={sciFiTV.map(transformTV)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-scifi"
          />
        </div>

        {/* Crime Shows */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Crime Shows
            </h2>
          </div>
          <SimpleMediaCarousel
            items={crimeTV.map(transformTV)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-crime"
          />
        </div>

        {/* Documentaries */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Documentaries
            </h2>
          </div>
          <SimpleMediaCarousel
            items={documentaryTV.map(transformTV)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-documentary"
          />
        </div>

        {/* Anime Series */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Anime Series
            </h2>
          </div>
          <SimpleMediaCarousel
            items={animeTV.map(transformTV)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="tv-anime"
          />
        </div>
      </div>
    </AppShell>
  );
}
