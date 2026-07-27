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

export default function AnimePage() {
  const router = useRouter();
  const padding = useResponsivePadding();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fetch TV show data (anime are TV shows in TMDB)
  const { data: trendingTV } = useTrendingTV();
  const { data: popularTV } = usePopularTV();
  const { data: topRatedTV } = useTopRatedTV();

  // Filter for anime only (Japanese origin country OR animation genre 16)
  const isAnime = (show: any) => {
    return show.origin_country?.includes('JP') || show.genre_ids?.includes(16);
  };

  const trendingAnime = trendingTV?.filter(isAnime) || [];
  const popularAnime = popularTV?.results?.filter(isAnime) || [];
  const topRatedAnime = topRatedTV?.results?.filter(isAnime) || [];

  // Get hero anime (first 5 popular anime)
  const heroAnimeList = popularAnime.slice(0, 5);
  const heroAnime = heroAnimeList[currentHeroIndex];

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (heroAnimeList.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroAnimeList.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroAnimeList.length]);

  // Fetch logo for current hero anime
  const { data: heroImages } = useTVImages(heroAnime?.id || 0);
  const heroLogo = heroImages?.logos?.[0]?.file_path 
    ? getLogoUrl(heroImages.logos[0].file_path, 'original')
    : null;

  // Fetch full details for genres
  const { data: heroDetails } = useTVDetails(heroAnime?.id || 0);

  const handlePlay = (id?: number) => {
    const animeId = id || heroAnime?.id;
    if (heroAnime || id) {
      // Navigate to first episode of first season
      router.push(`/watch/anime/${animeId}/1/1`);
    }
  };

  const handleMoreInfo = () => {
    if (heroAnime) {
      router.push(`/anime/${heroAnime.id}`);
    }
  };

  const handleItemClick = (id: number) => {
    router.push(`/anime/${id}`);
  };

  // Transform TMDB data for display
  const transformAnime = (anime: any) => ({
    id: anime.id,
    title: anime.name,
    name: anime.name,
    posterPath: getPosterUrl(anime.poster_path) || '',
    voteAverage: anime.vote_average,
    releaseDate: anime.first_air_date,
    genreIds: anime.genre_ids,
  });

  // Filter anime by sub-genre
  const actionAnime = trendingAnime.filter((show: any) => 
    show.genre_ids?.includes(10759) // Action & Adventure
  );

  const comedyAnime = trendingAnime.filter((show: any) => 
    show.genre_ids?.includes(35) // Comedy
  );

  const dramaAnime = trendingAnime.filter((show: any) => 
    show.genre_ids?.includes(18) // Drama
  );

  const sciFiAnime = trendingAnime.filter((show: any) => 
    show.genre_ids?.includes(10765) // Sci-Fi & Fantasy
  );

  const mysteryAnime = trendingAnime.filter((show: any) => 
    show.genre_ids?.includes(9648) // Mystery
  );

  return (
    <AppShell>
      {/* Hero Section */}
      {heroAnime && (
        <HeroBanner
          title={heroAnime.name}
          overview={heroAnime.overview}
          backdropPath={getBackdropUrl(heroAnime.backdrop_path, 'original') || ''}
          logoPath={heroLogo}
          voteAverage={heroAnime.vote_average}
          releaseDate={heroAnime.first_air_date}
          genres={heroDetails?.genres?.map((g: any) => g.name) || []}
          onPlay={() => handlePlay()}
          onMoreInfo={handleMoreInfo}
        />
      )}

      {/* Hero Navigation Dots */}
      {heroAnimeList.length > 1 && (
        <div className="flex justify-center gap-2 -mt-12 mb-4 relative z-20">
          {heroAnimeList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentHeroIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 w-6 hover:bg-white/60'
              }`}
              aria-label={`Go to anime ${index + 1}`}
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
          <SimpleMediaCarousel
            items={popularAnime.slice(0, 8).map(transformAnime)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-continue-watching"
          />
        </div>

        {/* Trending Anime */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trending Anime
            </h2>
          </div>
          <SimpleMediaCarousel
            items={trendingAnime.slice(0, 20).map(transformAnime)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-trending"
          />
        </div>

        {/* Top Rated Anime */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Top Rated Anime
            </h2>
          </div>
          <SimpleMediaCarousel
            items={topRatedAnime.map(transformAnime)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-top-rated"
          />
        </div>

        {/* Action Anime */}
        {actionAnime.length > 0 && (
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Action Anime
              </h2>
            </div>
            <SimpleMediaCarousel
              items={actionAnime.map(transformAnime)}
              type="tv"
              onItemClick={handleItemClick}
              zoneId="anime-action"
            />
          </div>
        )}

        {/* Comedy Anime */}
        {comedyAnime.length > 0 && (
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Comedy Anime
              </h2>
            </div>
            <SimpleMediaCarousel
              items={comedyAnime.map(transformAnime)}
              type="tv"
              onItemClick={handleItemClick}
              zoneId="anime-comedy"
            />
          </div>
        )}

        {/* Drama Anime */}
        {dramaAnime.length > 0 && (
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Drama Anime
              </h2>
            </div>
            <SimpleMediaCarousel
              items={dramaAnime.map(transformAnime)}
              type="tv"
              onItemClick={handleItemClick}
              zoneId="anime-drama"
            />
          </div>
        )}

        {/* Sci-Fi & Fantasy Anime */}
        {sciFiAnime.length > 0 && (
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Sci-Fi & Fantasy Anime
              </h2>
            </div>
            <SimpleMediaCarousel
              items={sciFiAnime.map(transformAnime)}
              type="tv"
              onItemClick={handleItemClick}
              zoneId="anime-scifi"
            />
          </div>
        )}

        {/* Mystery Anime */}
        {mysteryAnime.length > 0 && (
          <div className="space-y-6">
            <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Mystery Anime
              </h2>
            </div>
            <SimpleMediaCarousel
              items={mysteryAnime.map(transformAnime)}
              type="tv"
              onItemClick={handleItemClick}
              zoneId="anime-mystery"
            />
          </div>
        )}

        {/* Popular Anime */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Popular Anime
            </h2>
          </div>
          <SimpleMediaCarousel
            items={popularAnime.slice(5, 25).map(transformAnime)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-popular"
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
            items={popularAnime.slice(10, 25).map(transformAnime)}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-recommended"
          />
        </div>
      </div>
    </AppShell>
  );
}
