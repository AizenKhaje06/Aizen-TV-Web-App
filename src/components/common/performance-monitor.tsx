'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring, monitorLongTasks } from '@/lib/performance';

/**
 * Performance Monitor Component
 * 
 * Initializes performance monitoring when mounted.
 * Should be included once in the root layout.
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initPerformanceMonitoring();

    // Monitor long tasks in development
    if (process.env.NODE_ENV === 'development') {
      monitorLongTasks();
    }
  }, []);

  return null;
}
