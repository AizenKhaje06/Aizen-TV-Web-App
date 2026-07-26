/**
 * Central Error Handler
 * 
 * Handles all application errors consistently with:
 * - Logging
 * - User notification
 * - Error recovery
 * - External service integration
 */

import { logger } from '../logger';
import {
  AppError,
  isAppError,
  NetworkError,
  APIError,
  ErrorCode,
} from './error-types';

export interface ErrorHandlerOptions {
  silent?: boolean;
  showToast?: boolean;
  logError?: boolean;
  context?: Record<string, unknown>;
}

class ErrorHandler {
  /**
   * Handle application error
   */
  handle(error: unknown, options: ErrorHandlerOptions = {}): void {
    const {
      silent = false,
      showToast = true,
      logError = true,
      context = {},
    } = options;

    // Normalize error to AppError
    const appError = this.normalizeError(error);

    // Log error
    if (logError) {
      this.logError(appError, context);
    }

    // Show user notification
    if (!silent && showToast) {
      this.showUserNotification(appError);
    }

    // Handle specific error types
    this.handleSpecificError(appError);
  }

  /**
   * Normalize any error to AppError
   */
  private normalizeError(error: unknown): AppError {
    if (isAppError(error)) {
      return error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new NetworkError();
    }

    if (error instanceof Error) {
      return new AppError(
        error.message,
        ErrorCode.UNKNOWN_ERROR,
        undefined,
        { originalError: error.name }
      );
    }

    return new AppError(
      'An unexpected error occurred',
      ErrorCode.UNKNOWN_ERROR
    );
  }

  /**
   * Log error based on severity
   */
  private logError(error: AppError, context: Record<string, unknown>): void {
    const logContext = {
      ...context,
      code: error.code,
      statusCode: error.statusCode,
      ...error.context,
    };

    if (error.statusCode && error.statusCode >= 500) {
      logger.fatal(error.message, logContext, error);
    } else if (error.code === ErrorCode.NETWORK_ERROR) {
      logger.warn(error.message, logContext, error);
    } else {
      logger.error(error.message, logContext, error);
    }
  }

  /**
   * Show user-friendly notification
   */
  private showUserNotification(error: AppError): void {
    const message = error.getUserMessage();

    // TODO: Integrate with toast notification system
    // For now, log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('User Error:', message);
    }

    // In production, this would trigger a toast notification
    // toast.error(message);
  }

  /**
   * Handle specific error types with custom logic
   */
  private handleSpecificError(error: AppError): void {
    switch (error.code) {
      case ErrorCode.RATE_LIMIT:
        // Could implement exponential backoff or retry logic
        break;

      case ErrorCode.UNAUTHORIZED:
        // Could redirect to login (when authentication is implemented)
        break;

      case ErrorCode.NETWORK_ERROR:
        // Could show offline banner
        break;

      case ErrorCode.PLAYER_ERROR:
        // Could attempt to reload player or switch providers
        break;

      default:
        // Generic error handling
        break;
    }
  }

  /**
   * Handle API response errors
   */
  handleAPIError(response: Response, context?: Record<string, unknown>): never {
    const error = new APIError(
      `API request failed with status ${response.status}`,
      response.status,
      {
        ...context,
        url: response.url,
      }
    );

    this.handle(error);
    throw error;
  }

  /**
   * Handle async errors with automatic logging
   */
  async handleAsync<T>(
    promise: Promise<T>,
    options?: ErrorHandlerOptions
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.handle(error, options);
      throw error;
    }
  }

  /**
   * Create error recovery wrapper
   */
  withRecovery<T>(
    fn: () => T,
    fallback: T,
    options?: ErrorHandlerOptions
  ): T {
    try {
      return fn();
    } catch (error) {
      this.handle(error, { ...options, silent: true });
      return fallback;
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export convenience functions
export const handleError = (error: unknown, options?: ErrorHandlerOptions) =>
  errorHandler.handle(error, options);

export const handleAPIError = (response: Response, context?: Record<string, unknown>) =>
  errorHandler.handleAPIError(response, context);

export const handleAsync = <T>(promise: Promise<T>, options?: ErrorHandlerOptions) =>
  errorHandler.handleAsync(promise, options);

export const withRecovery = <T>(
  fn: () => T,
  fallback: T,
  options?: ErrorHandlerOptions
) => errorHandler.withRecovery(fn, fallback, options);
