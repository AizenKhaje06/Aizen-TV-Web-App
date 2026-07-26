'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { getBackdropUrl } from '@/services/tmdb/images';

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  episodes?: Episode[];
}

interface EpisodeSelectorProps {
  tvId: number;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
  onEpisodeSelect?: (season: number, episode: number) => void;
}

export function EpisodeSelector({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
  onEpisodeSelect,
}: EpisodeSelectorProps) {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

  // Filter out season 0 (specials) for now
  const regularSeasons = seasons.filter((s) => s.season_number > 0);
  const currentSeasonData = regularSeasons.find((s) => s.season_number === selectedSeason);

  const handleEpisodeClick = (episodeNumber: number) => {
    if (onEpisodeSelect) {
      onEpisodeSelect(selectedSeason, episodeNumber);
    } else {
      router.push(`/watch/tv/${tvId}/${selectedSeason}/${episodeNumber}`);
    }
  };

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setIsSeasonDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Season Selector */}
      <div className="mb-6">
        <div className="relative inline-block">
          <button
            onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <span className="font-semibold">
              Season {selectedSeason}
            </span>
            <ChevronDown
              className={cn(
                'w-5 h-5 transition-transform',
                isSeasonDropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Season Dropdown */}
          <AnimatePresence>
            {isSeasonDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
              >
                {regularSeasons.map((season) => (
                  <button
                    key={season.season_number}
                    onClick={() => handleSeasonChange(season.season_number)}
                    className={cn(
                      'w-full px-6 py-3 text-left hover:bg-gray-700 transition-colors',
                      season.season_number === selectedSeason && 'bg-gray-700 text-primary'
                    )}
                  >
                    <div className="font-semibold">{season.name}</div>
                    <div className="text-sm text-gray-400">
                      {season.episode_count} Episodes
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSeasonData?.episodes?.map((episode) => {
          const isCurrentEpisode =
            episode.episode_number === currentEpisode &&
            selectedSeason === currentSeason;

          return (
            <motion.div
              key={episode.episode_number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'group relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary',
                isCurrentEpisode && 'ring-2 ring-primary'
              )}
              onClick={() => handleEpisodeClick(episode.episode_number)}
            >
              {/* Episode Thumbnail */}
              <div className="relative aspect-video bg-gray-800">
                {episode.still_path ? (
                  <Image
                    src={getBackdropUrl(episode.still_path) || ''}
                    alt={episode.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-600" />
                  </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-16 h-16 text-white fill-white" />
                </div>

                {/* Episode Number Badge */}
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-sm font-semibold">
                  E{episode.episode_number}
                </div>

                {/* Currently Playing Badge */}
                {isCurrentEpisode && (
                  <div className="absolute top-2 right-2 bg-primary px-2 py-1 rounded text-sm font-semibold">
                    Now Playing
                  </div>
                )}
              </div>

              {/* Episode Info */}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1 line-clamp-1">
                  {episode.episode_number}. {episode.name}
                </h3>
                {episode.runtime && (
                  <p className="text-gray-400 text-sm mb-2">{episode.runtime}min</p>
                )}
                <p className="text-gray-400 text-sm line-clamp-2">
                  {episode.overview || 'No description available.'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show message if no episodes */}
      {(!currentSeasonData?.episodes || currentSeasonData.episodes.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400">No episodes available for this season.</p>
        </div>
      )}
    </div>
  );
}
