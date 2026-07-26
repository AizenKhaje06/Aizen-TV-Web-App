'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TVFocusable } from '../focus/tv-focusable';
import { getImageUrl } from '@/services/tmdb/images';
import { cn } from '@/lib/cn';
import { Star, Play } from 'lucide-react';
import { useIsTVMode } from '../focus/tv-focus-provider';

interface TVMediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating?: number;
  year?: string;
  mediaType?: 'movie' | 'tv';
  onClick?: () => void;
  className?: string;
  size?: 'normal' | 'large';
}

export function TVMediaCard({
  title,
  posterPath,
  rating,
  year,
  mediaType,
  onClick,
  className,
  size = 'normal',
}: TVMediaCardProps) {
  const isTVMode = useIsTVMode();

  const cardWidth = size === 'large' ? 320 : 280;
  const cardHeight = size === 'large' ? 480 : 420;

  return (
    <TVFocusable
      onSelect={onClick}
      className={cn(
        'flex-shrink-0 rounded-lg overflow-hidden bg-card transition-all',
        isTVMode && 'focus:shadow-2xl focus:shadow-primary/50',
        className
      )}
      style={{
        width: cardWidth,
        minWidth: cardWidth,
      }}
    >
      <div className="relative group">
        {/* Poster Image */}
        <div
          className="relative overflow-hidden bg-muted"
          style={{ height: cardHeight }}
        >
          {posterPath ? (
            <Image
              src={getImageUrl(posterPath, 'poster', 'large') || ''}
              alt={title}
              fill
              className="object-cover"
              sizes={`${cardWidth}px`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Overlay on Focus/Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Play Button */}
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileFocus={{ scale: 1.1 }}
                className="flex items-center justify-center"
              >
                <div className="bg-primary rounded-full p-3">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Rating Badge */}
          {rating && rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-3">
          <h3
            className={cn(
              'font-semibold line-clamp-2',
              size === 'large' ? 'text-lg' : 'text-base'
            )}
          >
            {title}
          </h3>

          {year && (
            <p className="text-sm text-muted-foreground mt-1">{year}</p>
          )}

          {mediaType && (
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                {mediaType === 'movie' ? 'Movie' : 'TV Show'}
              </span>
            </div>
          )}
        </div>
      </div>
    </TVFocusable>
  );
}
