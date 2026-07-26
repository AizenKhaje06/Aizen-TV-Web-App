/**
 * Adaptive Media Grid
 * 
 * Automatically switches between standard grid and TV-optimized grid
 * based on TV mode detection.
 */

'use client';

import { motion } from 'framer-motion';
import { useTVMode } from '@/hooks/use-tv-mode';
import { MediaCard } from './media-card';
import { TVFocusGroup } from '@/components/tv/focus/tv-focus-group';
import { TVMediaCard } from '@/components/tv/media/tv-media-card';
import { staggerContainerVariants, staggerItemVariants } from '@/styles/animations';

interface MediaItem {
  id: number;
  title: string;
  posterPath: string;
  voteAverage?: number;
  type: 'movie' | 'tv';
}

interface AdaptiveMediaGridProps {
  items: MediaItem[];
  gridId?: string;
}

export function AdaptiveMediaGrid({ items, gridId = 'search-results' }: AdaptiveMediaGridProps) {
  const { isTVMode } = useTVMode();

  // In TV mode, use TVFocusGroup with TVMediaCard
  if (isTVMode) {
    return (
      <TVFocusGroup 
        groupId={gridId}
        orientation="grid"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {items.map((item) => (
          <TVMediaCard
            key={`${item.type}-${item.id}`}
            id={item.id}
            title={item.title}
            posterPath={item.posterPath}
            rating={item.voteAverage}
            onClick={() => {
              // Navigation handled by TVMediaCard internally
              window.location.href = `/${item.type}/${item.id}`;
            }}
          />
        ))}
      </TVFocusGroup>
    );
  }

  // Standard web mode grid
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {items.map((item) => (
        <motion.div key={`${item.type}-${item.id}`} variants={staggerItemVariants}>
          <MediaCard
            id={item.id}
            title={item.title}
            posterPath={item.posterPath}
            voteAverage={item.voteAverage}
            type={item.type}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
