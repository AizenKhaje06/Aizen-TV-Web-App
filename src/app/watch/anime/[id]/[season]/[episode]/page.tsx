'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/player/video-player';
import { LoadingScreen } from '@/components/common/loading-spinner';
import { ApiError } from '@/components/common/api-error';
import { buildEpisodeSource } from '@/services/player/player-builder';
import { useTVDetails } from '@/hooks/tmdb/use-tv';
import { tvService } from '@/services/tmdb/tv.service';
import { usePlayerStoreV2 } from '@/store/player-store-v2';

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

interface SeasonWithEpisodes {
  season_number: number;
  name: string;
  episode_count: number;
  episodes?: Episode[];
}

export default function WatchAnimePage({
  params,
}: {
  params: Promise<{ id: string; season: string; episode: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const animeId = parseInt(resolvedParams.id);
  const seasonNumber = parseInt(resolvedParams.season);
  const episodeNumber = parseInt(resolvedParams.episode);

  const { data: anime, isLoading, error, refetch } = useTVDetails(animeId);
  const [seasons, setSeasons] = useState<SeasonWithEpisodes[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  
  const { autoplayNextEpisode } = usePlayerStoreV2();

  // Fetch season details with episodes
  useEffect(() => {
    if (!anime) return;

    const fetchSeasonDetails = async () => {
      setLoadingEpisodes(true);
      try {
        const seasonsWithEpisodes = await Promise.all(
          (anime.seasons || []).map(async (season) => {
            if (season.season_number === 0) return season as SeasonWithEpisodes; // Skip specials for now
            
            try {
              const seasonData = await tvService.getSeasonDetails(animeId, season.season_number);
              return {
                season_number: season.season_number,
                name: season.name,
                episode_count: season.episode_count,
                episodes: seasonData.episodes,
              } as SeasonWithEpisodes;
            } catch {
              return season as SeasonWithEpisodes;
            }
          })
        );

        setSeasons(seasonsWithEpisodes);

        // Find current episode
        const currentSeason = seasonsWithEpisodes.find(
          (s) => s.season_number === seasonNumber
        );
        const episode = currentSeason?.episodes?.find(
          (e) => e.episode_number === episodeNumber
        );
        setCurrentEpisode(episode || null);
      } catch (err) {
        console.error('Failed to fetch season details:', err);
      } finally {
        setLoadingEpisodes(false);
      }
    };

    fetchSeasonDetails();
  }, [anime, animeId, seasonNumber, episodeNumber]);

  if (isLoading || loadingEpisodes) {
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

  // Build video source
  const episodeTitle = currentEpisode
    ? `${anime.name} - S${seasonNumber}E${episodeNumber}: ${currentEpisode.name}`
    : `${anime.name} - S${seasonNumber}E${episodeNumber}`;

  const videoSource = buildEpisodeSource(
    anime.id,
    seasonNumber,
    episodeNumber,
    episodeTitle
  );

  const handleEpisodeEnd = () => {
    if (!autoplayNextEpisode) {
      return;
    }

    // Find next episode
    const currentSeason = seasons.find((s) => s.season_number === seasonNumber);
    const nextEpisode = currentSeason?.episodes?.find(
      (e) => e.episode_number === episodeNumber + 1
    );

    if (nextEpisode) {
      // Play next episode in same season
      router.push(`/watch/anime/${animeId}/${seasonNumber}/${nextEpisode.episode_number}`);
    } else {
      // Try next season
      const nextSeason = seasons.find((s) => s.season_number === seasonNumber + 1);
      if (nextSeason && nextSeason.episodes && nextSeason.episodes.length > 0) {
        router.push(`/watch/anime/${animeId}/${nextSeason.season_number}/1`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player - Full screen */}
      <VideoPlayer
        source={videoSource}
        onEnded={handleEpisodeEnd}
        className="w-full h-screen"
      />
    </div>
  );
}
