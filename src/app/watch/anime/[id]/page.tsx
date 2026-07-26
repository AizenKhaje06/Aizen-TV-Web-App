'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/player/video-player';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { VideoSource } from '@/services/player/types';
import { useAnimeDetails } from '@/hooks/anilist/use-anime';

export default function WatchAnimeMoviePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const animeId = parseInt(resolvedParams.id);

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
  
  // Build MegaPlay.buzz video source using AniList ID
  // For movies, use episode 1
  // Format: https://megaplay.buzz/stream/ani/{anilist-id}/{ep-num}/{language}
  const videoSource: VideoSource = {
    url: `https://megaplay.buzz/stream/ani/${animeId}/1/sub`,
    type: 'movie',
    tmdbId: animeId,
    title: title,
  };

  const handleMovieEnd = () => {
    // Navigate back to anime details
    router.push(`/anime/${animeId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer
        source={videoSource}
        onEnded={handleMovieEnd}
        className="w-full h-screen"
      />
    </div>
  );
}
