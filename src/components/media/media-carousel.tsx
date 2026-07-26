'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaCard } from './media-card';
import { cn } from '@/lib/cn';
import { useSettingsStore } from '@/store/settings-store';
import { useTVNavigation } from '@/hooks/use-tv-navigation';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  posterPath: string;
  voteAverage?: number;
  releaseDate?: string;
  genreIds?: number[];
}

interface MediaCarouselProps {
  items: MediaItem[];
  title: string;
  type?: 'movie' | 'tv';
  onItemClick?: (id: number) => void;
}

export function MediaCarousel({
  items,
  title,
  type = 'movie',
  onItemClick,
}: MediaCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isTVMode = useSettingsStore((state) => state.isTVMode);

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

  // TV Navigation
  useTVNavigation({
    onLeft: () => {
      if (isTVMode && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        scroll('left');
      }
    },
    onRight: () => {
      if (isTVMode && currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        scroll('right');
      }
    },
    enabled: isTVMode,
  });

  return (
    <div className="relative">
      {/* Title - Added extra left padding for sidebar */}
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Left Arrow */}
        {canScrollLeft && !isTVMode && (
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
            'flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth overflow-y-visible',
            'pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16',
            'py-16 md:py-20',
            isTVMode && 'focus-within:ring-2 focus-within:ring-primary'
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item) => (
            <MediaCard
              key={item.id}
              id={item.id}
              title={item.title || item.name || 'Untitled'}
              posterPath={item.posterPath}
              voteAverage={item.voteAverage}
              releaseDate={item.releaseDate}
              genreIds={item.genreIds}
              type={type}
              size={isTVMode ? 'lg' : 'md'}
              onPlay={() => onItemClick?.(item.id)}
              className="flex-shrink-0"
            />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && !isTVMode && (
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

      {/* TV Mode Indicators */}
      {isTVMode && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-primary w-4'
                  : 'bg-gray-600'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
