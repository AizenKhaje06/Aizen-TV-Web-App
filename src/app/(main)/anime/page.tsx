'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeroBanner } from '@/components/media/hero-banner';
import { SimpleMediaCarousel } from '@/components/media/simple-media-carousel';
import {
  useTrendingAnime,
  usePopularAnime,
  useTopRatedAnime,
  useCurrentlyAiringAnime,
  useUpcomingAnime
} from '@/hooks/anilist/use-anime';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';

export default function AnimePage() {
  const router = useRouter();
  const padding = useResponsivePadding();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fetch anime data from AniList
  const { data: trendingAnime } = useTrendingAnime(1, 20);
  const { data: popularAnime } = usePopularAnime(1, 20);
  const { data: topRatedAnime } = useTopRatedAnime(1, 15);
  const { data: currentlyAiringAnime } = useCurrentlyAiringAnime(1, 20);
  const { data: upcomingAnime } = useUpcomingAnime(1, 15);

  // Get hero anime (first 5 trending)
  const heroAnimeList = trendingAnime?.slice(0, 5) || [];
  const heroAnime = heroAnimeList[currentHeroIndex];

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (heroAnimeList.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroAnimeList.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroAnimeList.length]);

  const handlePlay = (id?: number) => {
    const animeId = id || heroAnime?.id;
    // TODO: Navigate to anime watch page
    router.push(`/anime/${animeId}`);
  };

  const handleMoreInfo = () => {
    if (heroAnime) {
      router.push(`/anime/${heroAnime.id}`);
    }
  };

  const handleItemClick = (id: number) => {
    router.push(`/anime/${id}`);
  };

  // Transform AniList data for display
  const transformAnime = (anime: any) => ({
    id: anime.id,
    title: anime.title?.english || anime.title?.romaji || anime.title?.native,
    name: anime.title?.english || anime.title?.romaji || anime.title?.native,
    posterPath: anime.coverImage?.extraLarge || anime.coverImage?.large,
    voteAverage: anime.averageScore ? anime.averageScore / 10 : 0,
    releaseDate: anime.seasonYear?.toString() || '',
    genreIds: anime.genres || [],
  });

  return (
    <AppShell>
      {/* Hero Section */}
      {heroAnime && (
        <HeroBanner
          title={heroAnime.title?.english || heroAnime.title?.romaji || heroAnime.title?.native}
          overview={heroAnime.description?.replace(/<[^>]*>/g, '') || ''}
          backdropPath={heroAnime.bannerImage || heroAnime.coverImage?.extraLarge}
          logoPath={null}
          voteAverage={heroAnime.averageScore ? heroAnime.averageScore / 10 : undefined}
          releaseDate={heroAnime.seasonYear?.toString()}
          genres={heroAnime.genres || []}
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
            items={popularAnime?.slice(0, 8).map(transformAnime) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-continue-watching"
          />
        </div>

        {/* Trending Anime (Top 10) */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trending Anime
            </h2>
          </div>
          <SimpleMediaCarousel
            items={trendingAnime?.slice(0, 10).map(transformAnime) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-trending"
          />
        </div>

        {/* New Anime Releases */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              New Anime Releases
            </h2>
          </div>
          <SimpleMediaCarousel
            items={upcomingAnime?.map(transformAnime) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-new-releases"
          />
        </div>

        {/* New Episodes */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              New Episodes
            </h2>
          </div>
          <SimpleMediaCarousel
            items={currentlyAiringAnime?.slice(0, 15).map(transformAnime) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-new-episodes"
          />
        </div>

        {/* Currently Airing */}
        <div className="space-y-6">
          <div style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Currently Airing
            </h2>
          </div>
          <SimpleMediaCarousel
            items={currentlyAiringAnime?.map(transformAnime) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-currently-airing"
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
            items={topRatedAnime?.map(transformAnime) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-top-rated"
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
            items={popularAnime?.slice(10, 25).map(transformAnime) || []}
            type="tv"
            onItemClick={handleItemClick}
            zoneId="anime-recommended"
          />
        </div>
      </div>
    </AppShell>
  );
}
