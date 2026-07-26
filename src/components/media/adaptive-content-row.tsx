/**
 * Adaptive Content Row
 * 
 * Automatically switches between standard ContentRow and TVCarousel
 * based on TV mode detection.
 */

'use client';

import { useTVMode } from '@/hooks/use-tv-mode';
import { ContentRow } from './content-row';
import { TVCarousel } from '@/components/tv/focus/tv-carousel';
import { TVMediaCard } from '@/components/tv/media/tv-media-card';

interface AdaptiveContentRowProps {
  title: string;
  items: any[];
  type?: 'movie' | 'tv';
  isLoading?: boolean;
  onItemClick?: (id: number) => void;
}

export function AdaptiveContentRow({
  title,
  items,
  type = 'movie',
  isLoading = false,
  onItemClick,
}: AdaptiveContentRowProps) {
  const { isTVMode } = useTVMode();

  // In TV mode, use TVCarousel with TVMediaCard
  if (isTVMode) {
    return (
      <TVCarousel className="px-4 md:px-8 lg:px-12">
        {isLoading ? (
          // Loading state
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] w-[200px] animate-pulse rounded-lg bg-muted"
            />
          ))
        ) : (
          items.map((item) => (
            <TVMediaCard
              key={item.id}
              id={item.id}
              title={item.title || item.name}
              posterPath={item.posterPath}
              rating={item.voteAverage}
              onClick={() => onItemClick?.(item.id)}
            />
          ))
        )}
      </TVCarousel>
    );
  }

  // Standard web mode, use ContentRow with MediaCard
  return (
    <ContentRow
      title={title}
      items={items}
      type={type}
      isLoading={isLoading}
      onItemClick={onItemClick}
    />
  );
}
