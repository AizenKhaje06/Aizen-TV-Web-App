/**
 * Custom Error Types for MyStream
 * 
 * Provides specific error classes for different failure scenarios
 * with user-friendly messages and structured error information.
 */

export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // API errors
  API_ERROR = 'API_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMIT = 'RATE_LIMIT',
  
  // Player errors
  PLAYER_ERROR = 'PLAYER_ERROR',
  STREAM_ERROR = 'STREAM_ERROR',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Application errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Base Application Error
 */
export class AppError extends Error {
  code: ErrorCode;
  statusCode?: number;
  isOperational: boolean;
  context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return this.message;
  }

  /**
   * Get sanitized error for logging
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  constructor(message = 'Network connection failed', context?: Record<string, unknown>) {
    super(message, ErrorCode.NETWORK_ERROR, undefined, context);
  }

  getUserMessage(): string {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
}

/**
 * API-related errors
 */
export class APIError extends AppError {
  constructor(message: string, statusCode?: number, context?: Record<string, unknown>) {
    super(message, ErrorCode.API_ERROR, statusCode, context);
  }

  getUserMessage(): string {
    if (this.statusCode === 404) {
      return 'Content not found. It may have been removed or is unavailable.';
    }
    if (this.statusCode === 429) {
      return 'Too many requests. Please try again in a moment.';
    }
    if (this.statusCode && this.statusCode >= 500) {
      return 'Server error. Please try again later.';
    }
    return 'Unable to load content. Please try again.';
  }
}

/**
 * Not Found errors
 */
export class NotFoundError extends AppError {
  constructor(resource: string, context?: Record<string, unknown>) {
    super(`${resource} not found`, ErrorCode.NOT_FOUND, 404, context);
  }

  getUserMessage(): string {
    return 'Content not found. It may have been removed or is unavailable.';
  }
}

/**
 * Player-related errors
 */
export class PlayerError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.PLAYER_ERROR, undefined, context);
  }

  getUserMessage(): string {
    return 'Unable to load video. Please try again or try a different source.';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, context);
  }

  getUserMessage(): string {
    return 'Invalid input. Please check your information and try again.';
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends AppError {
  constructor(message = 'Request timeout', context?: Record<string, unknown>) {
    super(message, ErrorCode.TIMEOUT_ERROR, 408, context);
  }

  getUserMessage(): string {
    return 'Request timed out. Please try again.';
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends AppError {
  constructor(retryAfter?: number, context?: Record<string, unknown>) {
    const message = retryAfter
      ? `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      : 'Too many requests. Please try again later.';
    
    super(message, ErrorCode.RATE_LIMIT, 429, { ...context, retryAfter });
  }

  getUserMessage(): string {
    const retryAfter = this.context?.retryAfter as number | undefined;
    return retryAfter
      ? `Too many requests. Please wait ${retryAfter} seconds and try again.`
      : 'Too many requests. Please try again in a moment.';
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Extract error message safely
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.getUserMessage();
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
