'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/app-shell';
import { RatingBadge } from '@/components/media/rating-badge';
import { GenreBadge } from '@/components/media/genre-badge';
import { AdaptiveContentRow } from '@/components/media/adaptive-content-row';
import { AdaptiveActionButtons } from '@/components/media/adaptive-action-buttons';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { fadeInUpVariants } from '@/styles/animations';
import { useTVDetails, useTVCredits, useTVRecommendations } from '@/hooks/tmdb/use-tv';
import { getPosterUrl, getBackdropUrl, getProfileUrl } from '@/services/tmdb/images';
import { formatDate } from '@/lib/utils';
import { useUserStore } from '@/store/user-store';

export default function TVDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const tvId = parseInt(resolvedParams.id);
  
  const { data: tvShow, isLoading: loadingTV, error, refetch } = useTVDetails(tvId);
  const { data: credits } = useTVCredits(tvId);
  const { data: recommendations } = useTVRecommendations(tvId);
  
  const isFavorite = useUserStore((state) => state.isFavorite(tvId));
  const addFavorite = useUserStore((state) => state.addFavorite);
  const removeFavorite = useUserStore((state) => state.removeFavorite);

  const handlePlay = () => {
    // Play first episode of first season
    router.push(`/watch/tv/${resolvedParams.id}/1/1`);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(tvId);
    } else if (tvShow) {
      addFavorite({
        id: tvShow.id,
        type: 'tv',
        title: tvShow.name,
        posterPath: tvShow.poster_path,
        backdropPath: tvShow.backdrop_path,
        addedAt: Date.now(),
      });
    }
  };

  if (loadingTV || !tvShow) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <AppShell>
        <ApiError
          error={error as Error}
          message="Failed to load TV show details"
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const transformTV = (show: any) => ({
    id: show.id,
    title: show.name,
    name: show.name,
    posterPath: getPosterUrl(show.poster_path) || '',
    voteAverage: show.vote_average,
  });

  return (
    <AppShell>
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        {tvShow.backdrop_path && (
          <Image
            src={getBackdropUrl(tvShow.backdrop_path) || ''}
            alt={tvShow.name}
            fill
            priority
            className="object-cover"
          />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 md:px-12 lg:px-16 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block"
          >
            {tvShow.poster_path && (
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={getPosterUrl(tvShow.poster_path) || ''}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {tvShow.name}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <RatingBadge rating={tvShow.vote_average} size="lg" />
              <span className="text-gray-300 text-lg">
                {formatDate(tvShow.first_air_date)}
              </span>
              <span className="text-gray-300 text-lg">
                {tvShow.number_of_seasons} {tvShow.number_of_seasons === 1 ? 'Season' : 'Seasons'}
              </span>
            </div>

            {/* Genres */}
            {tvShow.genres && tvShow.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
                  <GenreBadge key={genre.id} genre={genre.name} />
                ))}
              </div>
            )}

            {/* Actions */}
            <AdaptiveActionButtons
              onPlay={handlePlay}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />

            {/* Overview */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {tvShow.overview}
              </p>
            </div>

            {/* Seasons */}
            {tvShow.seasons && tvShow.seasons.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Seasons</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tvShow.seasons.filter(s => s.season_number > 0).map((season) => (
                    <div key={season.id} className="space-y-2">
                      {season.poster_path && (
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                          <Image
                            src={getPosterUrl(season.poster_path) || ''}
                            alt={season.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">{season.name}</p>
                        <p className="text-gray-400 text-xs">
                          {season.episode_count} Episodes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {credits && credits.cast && credits.cast.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="space-y-2">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                        {actor.profile_path && (
                          <Image
                            src={getProfileUrl(actor.profile_path) || ''}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{actor.name}</p>
                        <p className="text-gray-400 text-xs">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-16">
            <AdaptiveContentRow
              title="More Like This"
              items={recommendations.map(transformTV)}
              type="tv"
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}