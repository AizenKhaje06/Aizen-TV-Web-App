'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface Studio {
  id: string;
  name: string;
  logoUrl: string;
}

const STREAMING_PLATFORMS: Studio[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logoUrl: 'https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
  },
  {
    id: 'prime-video',
    name: 'Amazon Prime Video',
    logoUrl: 'https://image.tmdb.org/t/p/original/emthp39XA2YScoYL1p0sdbAH2WA.jpg',
  },
  {
    id: 'apple-tv',
    name: 'Apple TV+',
    logoUrl: 'https://image.tmdb.org/t/p/original/2E03IAZsX4ZaUqM7tXlctG5eCkP.jpg',
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    logoUrl: 'https://image.tmdb.org/t/p/original/8Gt1iClBlzTeQs8WQm8UrCoIxnQ.jpg',
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    logoUrl: 'https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',
  },
  {
    id: 'hulu',
    name: 'Hulu',
    logoUrl: 'https://image.tmdb.org/t/p/original/pqUTCleNUiTLAVlelGxUgWn1ELh.jpg',
  },
  {
    id: 'max',
    name: 'Max',
    logoUrl: 'https://image.tmdb.org/t/p/original/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg',
  },
  {
    id: 'mgm-plus',
    name: 'MGM+',
    logoUrl: 'https://image.tmdb.org/t/p/original/dAKyJNXsK07FlFp76HHwqm52QFH.jpg',
  },
  {
    id: 'paramount-plus',
    name: 'Paramount+',
    logoUrl: 'https://image.tmdb.org/t/p/original/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg',
  },
  {
    id: 'peacock',
    name: 'Peacock',
    logoUrl: 'https://image.tmdb.org/t/p/original/8GgAiT8BTMy7T9yYtnQ2pMy4kLl.jpg',
  },
  {
    id: 'shudder',
    name: 'Shudder',
    logoUrl: 'https://image.tmdb.org/t/p/original/fYkYJ0OLXM1LyGLMSTY3I0bYHLl.jpg',
  },
  {
    id: 'discovery-plus',
    name: 'Discovery+',
    logoUrl: 'https://image.tmdb.org/t/p/original/fJ4JnL7c99gEAUy5FIZ1A8kNEKE.jpg',
  },
];

interface StudiosRowProps {
  onStudioClick?: (studioId: string) => void;
}

export function StudiosRow({ onStudioClick }: StudiosRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

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
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.7;
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
    <div className="relative group">
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-6 md:py-8 pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {STREAMING_PLATFORMS.map((studio, index) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileFocus={{ scale: 1.08, zIndex: 10 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              onMouseEnter={() => setFocusedIndex(index)}
              onMouseLeave={() => setFocusedIndex(-1)}
              onClick={() => onStudioClick?.(studio.id)}
              tabIndex={0}
              className="flex-shrink-0 cursor-pointer group/card focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {/* Card Container */}
              <div
                className={cn(
                  'relative flex flex-col items-center',
                  'w-[140px] md:w-[150px] transition-all duration-200'
                )}
              >
                {/* Logo Card */}
                <div
                  className={cn(
                    'w-full h-[84px] md:h-[90px] rounded-2xl',
                    'bg-[#242424] border border-[#3A3A3A]',
                    'flex items-center justify-center p-4',
                    'transition-all duration-200',
                    'group-hover/card:border-cyan-400 group-hover/card:border-2',
                    'group-hover/card:bg-[#2a2a2a] group-hover/card:shadow-xl',
                    'group-hover/card:shadow-cyan-400/20',
                    focusedIndex === index && 'border-cyan-400 border-2 bg-[#2a2a2a] shadow-xl shadow-cyan-400/20'
                  )}
                >
                  {/* Platform Logo */}
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image
                      src={studio.logoUrl}
                      alt={studio.name}
                      width={120}
                      height={60}
                      quality={100}
                      unoptimized={false}
                      className="object-contain max-h-[55px] max-w-[115px] transition-transform duration-200 group-hover/card:scale-110"
                      style={{
                        filter: 'brightness(1.1) contrast(1.05)',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Platform Name */}
                <p
                  className={cn(
                    'mt-2 text-xs md:text-[13px] text-white text-center font-medium',
                    'max-w-[140px] md:max-w-[150px] truncate',
                    'transition-colors duration-200',
                    focusedIndex === index && 'text-cyan-400'
                  )}
                >
                  {studio.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
