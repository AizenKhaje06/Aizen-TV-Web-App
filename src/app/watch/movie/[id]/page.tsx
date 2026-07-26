'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/player/video-player';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { buildMovieSource } from '@/services/player/player-builder';
import { useMovieDetails } from '@/hooks/tmdb/use-movies';

export default function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const movieId = parseInt(resolvedParams.id);

  const { data: movie, isLoading, error, refetch } = useMovieDetails(movieId);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ApiError
          error={error as Error}
          message="Failed to load movie"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Build video source
  const videoSource = buildMovieSource(movie.id, movie.title);

  const handleMovieEnd = () => {
    // Navigate back or to movie details
    router.push(`/movie/${movie.id}`);
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
