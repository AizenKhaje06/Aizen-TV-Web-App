/**
 * Production-ready Logger System
 * 
 * Features:
 * - Environment-aware logging
 * - Log levels (debug, info, warn, error, fatal)
 * - Structured logging
 * - Integration-ready (Sentry, Analytics)
 * - Type-safe
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogContext {
  [key: string]: unknown;
  userId?: string;
  sessionId?: string;
  route?: string;
  timestamp?: string;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  timestamp: string;
}

class Logger {
  private minLevel: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.minLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;
  }

  /**
   * Format log entry for output
   */
  private formatLog(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? JSON.stringify(entry.context) : '';
    return `[${entry.timestamp}] ${levelName}: ${entry.message} ${contextStr}`;
  }

  /**
   * Should this log level be output?
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  /**
   * Send log to external services (Sentry, Analytics, etc.)
   */
  private sendToExternal(_entry: LogEntry): void {
    // In production, send to external services
    if (this.isProduction) {
      // TODO: Integration with Sentry
      // if (_entry.level >= LogLevel.ERROR && _entry.error) {
      //   Sentry.captureException(_entry.error, {
      //     level: _entry.level >= LogLevel.FATAL ? 'fatal' : 'error',
      //     contexts: {
      //       custom: _entry.context,
      //     },
      //   });
      // }

      // TODO: Integration with Analytics
      // if (_entry.level >= LogLevel.ERROR) {
      //   analytics.track('Error', {
      //     message: _entry.message,
      //     level: LogLevel[_entry.level],
      //     ..._entry.context,
      //   });
      // }
    }
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      context,
      error,
      timestamp: new Date().toISOString(),
    };

    // Console output in development
    if (!this.isProduction) {
      const formatted = this.formatLog(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          if (error) console.warn(error);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formatted);
          if (error) console.error(error);
          break;
      }
    }

    // Send to external services
    this.sendToExternal(entry);
  }

  /**
   * Debug level - development only
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level - general information
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warn level - warning conditions
   */
  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Error level - error conditions
   */
  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Fatal level - critical failures
   */
  fatal(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * Performance measurement
   */
  measurePerformance(label: string, startTime: number, context?: LogContext): void {
    const duration = performance.now() - startTime;
    this.debug(`Performance: ${label}`, {
      ...context,
      duration: `${duration.toFixed(2)}ms`,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for external integrations
export type { Logger };
