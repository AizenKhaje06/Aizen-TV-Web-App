'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Plus, Info } from 'lucide-react';
import { Focusable } from '@/components/navigation/focusable';

// TMDB Genre mapping
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

interface SimpleMediaCardProps {
  id: number;
  title: string;
  posterPath: string;
  voteAverage?: number;
  type?: 'movie' | 'tv';
  releaseDate?: string;
  genreIds?: number[];
  onPlay?: () => void;
  onAddToList?: () => void;
  isFirstCard?: boolean;
  zoneId: string;
  cardIndex: number;
  navigationRules?: any;
}

export function SimpleMediaCard({
  id,
  title,
  posterPath,
  voteAverage,
  type = 'movie',
  releaseDate,
  genreIds = [],
  onPlay,
  onAddToList,
  isFirstCard = false,
  zoneId,
  cardIndex,
  navigationRules,
}: SimpleMediaCardProps) {
  // Extract year from release date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // Get first genre name
  const primaryGenre = genreIds.length > 0 ? GENRE_MAP[genreIds[0]] : null;

  const cardId = `${zoneId}-card-${cardIndex}`;

  return (
    <Focusable
      id={cardId}
      zoneId={zoneId}
      zonePriority={100 - cardIndex} // Higher priority for earlier cards
      navigationRules={navigationRules}
      metadata={{
        cardIndex,
        isFirstInRow: isFirstCard,
        mediaId: id,
        mediaType: type,
      }}
      onFocusEnter={() => {
        // Optional: Add analytics or effects
      }}
      className="flex-shrink-0"
      focusClassName="ring-2 ring-cyan-400 rounded-lg"
    >
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        whileFocus={{ scale: 1.08, zIndex: 10 }}
        transition={{ duration: 0.2 }}
        className="relative cursor-pointer group/item"
        onClick={() => onPlay?.()}
      >
        <div className="relative flex flex-col">
          {/* Poster */}
          <div className="relative w-[200px] h-[300px] rounded-lg overflow-hidden bg-gray-800">
            {posterPath ? (
              <Image
                src={posterPath}
                alt={title}
                fill
                className="object-cover"
                sizes="200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-500 text-center p-4">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-xs">{title}</p>
                </div>
              </div>
            )}

            {/* Rating Badge - Always Visible (Top Right) */}
            {voteAverage && (
              <div className="absolute top-2 right-2 z-20">
                <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-white text-sm font-semibold">
                    {voteAverage.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Hover Overlay with gradient */}
            <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-all duration-200 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Hover Actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPlay?.();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-white/90 transition-colors"
                aria-label="Play"
              >
                <Play className="w-5 h-5 text-black fill-black" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToList?.();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/60 hover:border-white bg-black/40 hover:bg-black/60 transition-colors"
                aria-label="Add to list"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/60 hover:border-white bg-black/40 hover:bg-black/60 transition-colors"
                aria-label="More info"
              >
                <Info className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Metadata - Below poster */}
          <div className="mt-3 px-1 max-w-[200px]">
            {/* Title */}
            <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1">
              {title}
            </h3>

            {/* Type | Year | Genre (All Yellow) */}
            <div className="flex items-center gap-1.5 text-xs md:text-sm text-yellow-400 font-medium">
              <span className="capitalize">
                {type === 'movie' ? 'Movie' : 'TV Show'}
              </span>
              {year && (
                <>
                  <span>|</span>
                  <span>{year}</span>
                </>
              )}
              {primaryGenre && (
                <>
                  <span>|</span>
                  <span>{primaryGenre}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Focusable>
  );
}
