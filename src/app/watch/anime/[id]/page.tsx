'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/player/video-player';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { buildMovieSource } from '@/services/player/player-builder';
import { useTVDetails } from '@/hooks/tmdb/use-tv';

export default function WatchAnimeMoviePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const animeId = parseInt(resolvedParams.id);

  const { data: anime, isLoading, error, refetch } = useTVDetails(animeId);

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

  const title = anime.name || anime.original_name || '';
  
  // Build video source using TMDB ID + CineSrc
  // Format: https://cinesrc.st/embed/movie/{tmdb_id}
  const videoSource = buildMovieSource(anime.id, title);

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
