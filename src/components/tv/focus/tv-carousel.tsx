'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { useTVFocus } from './tv-focus-provider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TVCarouselProps {
  children: React.ReactNode;
  title?: string;
  itemWidth?: number;
  gap?: number;
  className?: string;
  onEndReached?: () => void;
}

export function TVCarousel({
  children,
  title,
  itemWidth = 280,
  gap = 16,
  className,
  onEndReached,
}: TVCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isTVMode } = useTVFocus();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Calculate scroll state
  useEffect(() => {
    if (!scrollRef.current) return;

    const updateScrollState = () => {
      if (!scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    updateScrollState();

    const scrollEl = scrollRef.current;
    scrollEl.addEventListener('scroll', updateScrollState);

    return () => {
      scrollEl.removeEventListener('scroll', updateScrollState);
    };
  }, [children]);

  // Handle focus changes
  useEffect(() => {
    if (!isTVMode || !scrollRef.current) return;

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const carousel = scrollRef.current;

      if (!carousel || !carousel.contains(target)) return;

      // Find index of focused item
      const items = Array.from(carousel.querySelectorAll('[data-focusable="true"]'));
      const index = items.indexOf(target);

      if (index !== -1) {
        setFocusedIndex(index);

        // Auto-scroll to keep focused item visible
        const itemLeft = index * (itemWidth + gap);
        const itemRight = itemLeft + itemWidth;
        const visibleLeft = carousel.scrollLeft;
        const visibleRight = visibleLeft + carousel.clientWidth;

        if (itemLeft < visibleLeft) {
          // Item is to the left of visible area
          carousel.scrollTo({
            left: itemLeft - gap,
            behavior: 'smooth',
          });
        } else if (itemRight > visibleRight) {
          // Item is to the right of visible area
          carousel.scrollTo({
            left: itemRight - carousel.clientWidth + gap,
            behavior: 'smooth',
          });
        }

        // Check if near end
        if (onEndReached && index >= items.length - 3) {
          onEndReached();
        }
      }
    };

    document.addEventListener('focus', handleFocus, true);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
    };
  }, [isTVMode, itemWidth, gap, onEndReached]);

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollRef.current) return;

    const newPosition = Math.max(0, scrollPosition - (itemWidth + gap) * 3);
    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
    setScrollPosition(newPosition);
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;

    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const newPosition = Math.min(maxScroll, scrollPosition + (itemWidth + gap) * 3);
    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
    setScrollPosition(newPosition);
  };

  return (
    <div ref={containerRef} className={cn('relative group', className)}>
      {/* Title */}
      {title && (
        <h2 className="text-2xl font-bold mb-4 px-4 md:px-8 lg:px-12 tv:px-16">
          {title}
        </h2>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {!isTVMode && canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start pl-4"
            aria-label="Scroll left"
          >
            <div className="bg-background/80 hover:bg-background rounded-full p-2">
              <ChevronLeft className="w-8 h-8" />
            </div>
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className={cn(
            'flex overflow-x-auto overflow-y-hidden scrollbar-hide px-4 md:px-8 lg:px-12 tv:px-16',
            'scroll-smooth'
          )}
          style={{
            gap: `${gap}px`,
          }}
        >
          {children}
        </div>

        {/* Right Arrow */}
        {!isTVMode && canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-4"
            aria-label="Scroll right"
          >
            <div className="bg-background/80 hover:bg-background rounded-full p-2">
              <ChevronRight className="w-8 h-8" />
            </div>
          </button>
        )}
      </div>

      {/* TV Mode Indicator */}
      {isTVMode && (
        <div className="absolute bottom-2 right-4 text-xs text-muted-foreground">
          {focusedIndex + 1} / {React.Children.count(children)}
        </div>
      )}
    </div>
  );
}
