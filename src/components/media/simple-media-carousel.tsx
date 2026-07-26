'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SimpleMediaCard } from './simple-media-card';
import { cn } from '@/lib/cn';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  posterPath: string;
  voteAverage?: number;
  releaseDate?: string;
  genreIds?: number[];
}

interface SimpleMediaCarouselProps {
  items: MediaItem[];
  type?: 'movie' | 'tv';
  onItemClick?: (id: number) => void;
  zoneId: string;
}

export function SimpleMediaCarousel({
  items,
  type = 'movie',
  onItemClick,
  zoneId,
}: SimpleMediaCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(checkScrollability, 300);
  };

  return (
    <div className="relative group/carousel">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
          aria-label="Scroll left"
        >
          <div className="w-10 h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </button>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        className={cn(
          'flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth',
          'pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16',
          'py-2'
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item, index) => {
          const isFirstCard = index === 0;

          return (
            <SimpleMediaCard
              key={item.id}
              id={item.id}
              title={item.title || item.name || 'Untitled'}
              posterPath={item.posterPath}
              voteAverage={item.voteAverage}
              releaseDate={item.releaseDate}
              genreIds={item.genreIds}
              type={type}
              onPlay={() => onItemClick?.(item.id)}
              isFirstCard={isFirstCard}
              zoneId={zoneId}
              cardIndex={index}
              navigationRules={
                isFirstCard
                  ? {
                      left: 'sidebar-home', // Return to sidebar from first card
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
          aria-label="Scroll right"
        >
          <div className="w-10 h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </button>
      )}
    </div>
  );
}
