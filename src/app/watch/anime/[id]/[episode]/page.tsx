'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { useAnimeDetails } from '@/hooks/anilist/use-anime';

export default function WatchAnimeEpisodePage({ 
  params 
}: { 
  params: Promise<{ id: string; episode: string }> 
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const animeId = parseInt(resolvedParams.id);
  const episodeNum = parseInt(resolvedParams.episode);

  const { data: anime, isLoading, error, refetch } = useAnimeDetails(animeId);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ApiError
          error={error as Error}
          message="Failed to load anime"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const title = anime.title?.english || anime.title?.romaji || anime.title?.native || '';
  
  // MegaPlay.buzz iframe URL - their default player
  const iframeUrl = `https://megaplay.buzz/stream/ani/${animeId}/${episodeNum}/sub`;

  const handleBack = () => {
    router.push(`/anime/${animeId}`);
  };

  const handleNextEpisode = () => {
    if (anime.episodes && episodeNum < anime.episodes) {
      router.push(`/watch/anime/${animeId}/${episodeNum + 1}`);
    }
  };

  const handlePrevEpisode = () => {
    if (episodeNum > 1) {
      router.push(`/watch/anime/${animeId}/${episodeNum - 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar with Back and Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent p-4 md:p-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm md:text-base font-medium">Back</span>
          </button>

          {/* Title */}
          <h1 className="text-white text-lg md:text-xl font-semibold truncate max-w-md text-center">
            {title} - Episode {episodeNum}
          </h1>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevEpisode}
              disabled={episodeNum <= 1}
              className="px-4 py-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextEpisode}
              disabled={!anime.episodes || episodeNum >= anime.episodes}
              className="px-4 py-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MegaPlay Default Player - Full Screen Iframe */}
      <iframe
        src={iframeUrl}
        className="w-full h-screen border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={`${title} - Episode ${episodeNum}`}
      />
    </div>
  );
}
