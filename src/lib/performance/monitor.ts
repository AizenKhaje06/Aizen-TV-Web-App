/**
 * Performance Monitoring
 * 
 * Monitors and reports application performance metrics including:
 * - Web Vitals (LCP, FID, CLS, FCP, TTFB)
 * - Custom performance marks
 * - Navigation timing
 * - Resource timing
 */

import { logger } from '../logger';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
}

/**
 * Web Vitals thresholds
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Get rating based on value and thresholds
 */
function getRating(
  metric: keyof typeof THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report performance metric
 */
function reportMetric(metric: PerformanceMetric): void {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Performance: ${metric.name}`, {
      value: `${metric.value.toFixed(2)}ms`,
      rating: metric.rating,
    });
  }

  // TODO: Send to analytics in production
  // if (process.env.NODE_ENV === 'production') {
  //   analytics.track('Performance', {
  //     metric: metric.name,
  //     value: metric.value,
  //     rating: metric.rating,
  //   });
  // }
}

/**
 * Monitor Web Vitals
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry;
    const value = lastEntry.startTime;

    reportMetric({
      name: 'LCP',
      value,
      rating: getRating('LCP', value),
    });
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry: any) => {
      const value = entry.processingStart - entry.startTime;

      reportMetric({
        name: 'FID',
        value,
        rating: getRating('FID', value),
      });
    });
  });
  fidObserver.observe({ type: 'first-input', buffered: true });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
  });
  clsObserver.observe({ type: 'layout-shift', buffered: true });

  // Report CLS when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      reportMetric({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
      });
    }
  });

  // First Contentful Paint (FCP)
  const fcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      const value = entry.startTime;

      reportMetric({
        name: 'FCP',
        value,
        rating: getRating('FCP', value),
      });
    });
  });
  fcpObserver.observe({ type: 'paint', buffered: true });

  // Navigation Timing (TTFB)
  if (window.performance && window.performance.timing) {
    const navTiming = window.performance.timing;
    const ttfb = navTiming.responseStart - navTiming.requestStart;

    reportMetric({
      name: 'TTFB',
      value: ttfb,
      rating: getRating('TTFB', ttfb),
    });
  }
}

/**
 * Custom performance mark
 */
export function mark(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure performance between two marks
 */
export function measure(name: string, startMark: string, endMark?: string): number | null {
  if (typeof performance === 'undefined') return null;

  try {
    if (!endMark) {
      performance.mark(endMark = `${startMark}-end`);
    }

    const measure = performance.measure(name, startMark, endMark);
    const duration = measure.duration;

    logger.debug(`Performance: ${name}`, {
      duration: `${duration.toFixed(2)}ms`,
    });

    return duration;
  } catch (error) {
    logger.warn('Performance measurement failed', { name }, error as Error);
    return null;
  }
}

/**
 * Report custom metric
 */
export function reportCustomMetric(name: string, value: number, unit = 'ms'): void {
  logger.debug(`Custom Metric: ${name}`, {
    value: `${value.toFixed(2)}${unit}`,
  });

  // TODO: Send to analytics
  // analytics.track('CustomMetric', { name, value, unit });
}

/**
 * Monitor long tasks (tasks taking >50ms)
 */
export function monitorLongTasks(): void {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        logger.warn('Long Task detected', {
          duration: `${entry.duration.toFixed(2)}ms`,
          startTime: entry.startTime,
        });
      });
    });

    observer.observe({ type: 'longtask', buffered: true });
  } catch (error) {
    // PerformanceObserver not supported
    logger.debug('Long task monitoring not supported');
  }
}

/**
 * Get memory usage (if available)
 */
export function getMemoryUsage(): Record<string, number> | null {
  if (typeof performance === 'undefined' || !(performance as any).memory) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize / 1048576, // Convert to MB
    totalJSHeapSize: memory.totalJSHeapSize / 1048576,
    jsHeapSizeLimit: memory.jsHeapSizeLimit / 1048576,
  };
}
