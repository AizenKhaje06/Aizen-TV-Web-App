'use client';

import { useState, useEffect } from 'react';

interface ResponsivePadding {
  left: string;
  right: string;
}

/**
 * Hook to calculate responsive padding based on viewport size
 * Ensures content never overlaps with the 80px collapsed sidebar
 */
export function useResponsivePadding(): ResponsivePadding {
  const [padding, setPadding] = useState<ResponsivePadding>({
    left: '84px', // 80px sidebar + 4px gap
    right: '16px',
  });

  useEffect(() => {
    const calculatePadding = () => {
      const width = window.innerWidth;
      
      // Sidebar is always 80px when collapsed (default state)
      const sidebarWidth = 80;
      
      // Calculate gap based on screen size
      let gap: number;
      let rightPadding: string;
      
      if (width < 768) {
        // Mobile: 4px gap
        gap = 4;
        rightPadding = '16px';
      } else if (width < 1024) {
        // Tablet: 8px gap
        gap = 8;
        rightPadding = '32px';
      } else if (width < 1536) {
        // Desktop: 16px gap
        gap = 16;
        rightPadding = '48px';
      } else {
        // Large desktop: 24px gap
        gap = 24;
        rightPadding = '64px';
      }
      
      const leftPadding = `${sidebarWidth + gap}px`;
      
      setPadding({
        left: leftPadding,
        right: rightPadding,
      });
      
      // Update CSS custom properties for use in CSS
      document.documentElement.style.setProperty('--content-padding-left', leftPadding);
      document.documentElement.style.setProperty('--content-padding-right', rightPadding);
    };

    // Calculate on mount
    calculatePadding();

    // Recalculate on resize with debouncing for performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculatePadding, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', calculatePadding);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', calculatePadding);
    };
  }, []);

  return padding;
}
