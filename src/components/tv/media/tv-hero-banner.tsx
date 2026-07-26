'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TVFocusable } from '../focus/tv-focusable';
import { getImageUrl } from '@/services/tmdb/images';
import { Play, Info, Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useIsTVMode } from '../focus/tv-focus-provider';

interface TVHeroBannerProps {
  id: number;
  title: string;
  overview: string;
  backdropPath: string | null;
  rating?: number;
  releaseDate?: string;
  mediaType?: 'movie' | 'tv';
  onPlay?: () => void;
  onInfo?: () => void;
  className?: string;
}

export function TVHeroBanner({
  title,
  overview,
  backdropPath,
  rating,
  releaseDate,
  mediaType,
  onPlay,
  onInfo,
  className,
}: TVHeroBannerProps) {
  const isTVMode = useIsTVMode();

  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {/* Background Image */}
      <div className="relative w-full h-[70vh] md:h-[80vh]">
        {backdropPath ? (
          <Image
            src={getImageUrl(backdropPath, 'backdrop', 'original') || ''}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-background" />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content - Added left padding to account for sidebar (80px collapsed) */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto pl-24 pr-4 md:pl-28 md:pr-8 lg:pl-32 lg:pr-12 tv:pl-32 tv:pr-16">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'font-bold text-white drop-shadow-lg',
                isTVMode ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'
              )}
            >
              {title}
            </motion.h1>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 text-base md:text-lg"
            >
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                </div>
              )}

              {year && <span>{year}</span>}

              {mediaType && (
                <span className="px-3 py-1 bg-primary/80 rounded text-sm font-semibold">
                  {mediaType === 'movie' ? 'Movie' : 'TV Series'}
                </span>
              )}
            </motion.div>

            {/* Overview */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cn(
                'text-white/90 drop-shadow line-clamp-3',
                isTVMode ? 'text-lg md:text-xl' : 'text-base md:text-lg'
              )}
            >
              {overview}
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              {/* Play Button */}
              <TVFocusable
                onSelect={onPlay}
                autoFocus={isTVMode}
                className="rounded-lg overflow-hidden"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors',
                    isTVMode ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'
                  )}
                >
                  <Play className={cn('fill-current', isTVMode ? 'w-6 h-6' : 'w-5 h-5')} />
                  <span>Play</span>
                </motion.button>
              </TVFocusable>

              {/* More Info Button */}
              <TVFocusable
                onSelect={onInfo}
                className="rounded-lg overflow-hidden"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-lg transition-colors',
                    isTVMode ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'
                  )}
                >
                  <Info className={cn(isTVMode ? 'w-6 h-6' : 'w-5 h-5')} />
                  <span>More Info</span>
                </motion.button>
              </TVFocusable>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
