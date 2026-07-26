'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Info } from 'lucide-react';
// import { cardVariants, cardLargeVariants } from '@/styles/animations';
import { cn } from '@/lib/cn';
// import { useSettingsStore } from '@/store/settings-store';

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

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string;
  voteAverage?: number;
  type?: 'movie' | 'tv';
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  releaseDate?: string;
  genreIds?: number[];
  onPlay?: () => void;
  onAddToList?: () => void;
  className?: string;
}

export function MediaCard({
  id,
  title,
  posterPath,
  voteAverage,
  type = 'movie',
  href,
  size = 'md',
  releaseDate,
  genreIds = [],
  onPlay,
  onAddToList,
  className,
}: MediaCardProps) {
  // const isTVMode = useSettingsStore((state) => state.isTVMode);
  
  const sizeClasses = {
    sm: 'w-[150px] h-[225px]',
    md: 'w-[200px] h-[300px]',
    lg: 'w-[280px] h-[420px]',
  };

  // const variants = isTVMode ? cardLargeVariants : cardVariants;
  const linkHref = href || `/${type}/${id}`;

  // Extract year from release date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // Get first genre name
  const primaryGenre = genreIds.length > 0 ? GENRE_MAP[genreIds[0]] : null;

  return (
    <motion.div
      initial={{ scale: 1, zIndex: 0 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 1.02, zIndex: 10 }}
      transition={{ duration: 0.2 }}
      className={cn('relative flex-shrink-0', className)}
    >
      <Link href={linkHref} className="block group/card cursor-pointer">
        {/* Poster Image */}
        <div className={cn('relative rounded-lg overflow-hidden', sizeClasses[size])}>
          <Image
            src={posterPath}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 280px"
            priority={false}
          />
          
          {/* Rating Badge - Always Visible (Top Right) */}
          {voteAverage && (
            <div className="absolute top-2 right-2 z-20">
              <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span className="text-white text-sm font-semibold">{voteAverage.toFixed(1)}</span>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200" />
          
          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
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
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/60 hover:border-white bg-black/40 hover:bg-black/60 transition-colors"
              aria-label="More info"
            >
              <Info className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Details - Always Visible (Not affected by scale) */}
        <div className="mt-2 px-1">
          {/* Title */}
          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1">
            {title}
          </h3>
          
          {/* Type | Year | Genre (All Yellow) */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-yellow-400 font-medium">
            <span className="capitalize">{type === 'movie' ? 'Movie' : 'TV Show'}</span>
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
      </Link>
    </motion.div>
  );
}
