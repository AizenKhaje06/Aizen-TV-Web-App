'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { cardVariants } from '@/styles/animations';
import { cn } from '@/lib/cn';
import { RatingBadge } from './rating-badge';

interface LandscapeCardProps {
  id: number;
  title: string;
  backdropPath: string;
  overview?: string;
  voteAverage?: number;
  type?: 'movie' | 'tv';
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  onPlay?: () => void;
  className?: string;
}

export function LandscapeCard({
  id,
  title,
  backdropPath,
  overview,
  voteAverage,
  type = 'movie',
  href,
  size = 'md',
  onPlay,
  className,
}: LandscapeCardProps) {
  const sizeClasses = {
    sm: 'w-[250px] h-[141px]',
    md: 'w-[350px] h-[197px]',
    lg: 'w-[500px] h-[281px]',
  };

  const linkHref = href || `/${type}/${id}`;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileFocus="focused"
      className={cn(
        'relative group cursor-pointer rounded-lg overflow-hidden',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        sizeClasses[size],
        className
      )}
      tabIndex={0}
    >
      <Link href={linkHref} className="block w-full h-full">
        {/* Backdrop Image */}
        <div className="relative w-full h-full">
          <Image
            src={backdropPath}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 250px, (max-width: 1024px) 350px, 500px"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.preventDefault();
                onPlay?.();
              }}
              className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transform scale-100 group-hover:scale-110 transition-transform"
              aria-label="Play"
            >
              <Play className="w-8 h-8 text-black fill-black ml-1" />
            </button>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Title */}
            <h3 className="text-white font-semibold text-base md:text-lg line-clamp-1">
              {title}
            </h3>
            
            {/* Overview (visible on hover) */}
            {overview && (
              <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">
                {overview}
              </p>
            )}
            
            {/* Rating */}
            {voteAverage && (
              <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">
                <RatingBadge rating={voteAverage} size="sm" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
