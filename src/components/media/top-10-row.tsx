'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface TopTenItem {
  id: number;
  title?: string;
  name?: string;
  posterPath: string;
  voteAverage?: number;
  releaseDate?: string;
}

interface TopTenRowProps {
  items: TopTenItem[];
  isLoading?: boolean;
  onItemClick?: (id: number) => void;
}

export function TopTenRow({
  items,
  isLoading = false,
  onItemClick,
}: TopTenRowProps) {
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

  if (isLoading) {
    return (
      <div className="relative group">
        <div className="flex gap-4 md:gap-6 overflow-hidden pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="relative flex-shrink-0"
            >
              <div className="w-[180px] md:w-[220px] h-[280px] md:h-[330px] bg-gray-800 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-10 md:py-12 pl-24 pr-4 md:pl-28 md:pr-12 lg:pl-32 lg:pr-16"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.slice(0, 10).map((item, index) => {
            const ranking = index + 1;
            const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                whileFocus={{ scale: 1.08, zIndex: 10 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="relative flex-shrink-0 cursor-pointer group/item"
                onClick={() => onItemClick?.(item.id)}
                tabIndex={0}
              >
                {/* Container with relative positioning */}
                <div className="relative flex items-end">
                  {/* Huge Ranking Number BEHIND - positioned absolutely */}
                  <div 
                    className="absolute left-0 bottom-12 md:bottom-16 z-0 pointer-events-none select-none"
                    style={{
                      transform: 'translateX(-10%)', // Slight negative offset
                    }}
                  >
                    <span 
                      className="font-black text-white leading-none block"
                      style={{
                        fontSize: 'clamp(140px, 15vw, 200px)',
                        WebkitTextStroke: '3px #000',
                        textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
                        opacity: 0.95,
                        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {ranking}
                    </span>
                  </div>

                  {/* Poster Card - overlaps number by 35-45% */}
                  <div 
                    className="relative z-10"
                    style={{
                      marginLeft: 'clamp(50px, 5vw, 70px)', // Creates the 35-45% overlap
                    }}
                  >
                    {/* Poster */}
                    <div className="relative w-[140px] md:w-[160px] lg:w-[180px] aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 shadow-xl">
                      {item.posterPath ? (
                        <Image
                          src={item.posterPath}
                          alt={item.title || item.name || 'Poster'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 140px, (max-width: 1024px) 160px, 180px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                          No Image
                        </div>
                      )}

                      {/* Hover Overlay with cyan glow effect */}
                      <div className={cn(
                        "absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-all duration-200",
                        "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
                        "ring-2 ring-cyan-400/50 group-hover/item:ring-cyan-400"
                      )} />
                    </div>

                    {/* Metadata - Below poster */}
                    <div className="mt-3 px-1 max-w-[140px] md:max-w-[160px] lg:max-w-[180px]">
                      {/* Title */}
                      <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1">
                        {item.title || item.name}
                      </h3>
                      
                      {/* Year • Type • Rating */}
                      <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400">
                        {year && (
                          <>
                            <span>{year}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>Movie</span>
                        {item.voteAverage && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white font-medium">
                              {item.voteAverage.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <div className="w-10 h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
