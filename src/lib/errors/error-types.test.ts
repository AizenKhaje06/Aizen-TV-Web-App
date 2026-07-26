/**
 * Error Types Tests
 */

import { describe, it, expect } from 'vitest';
import {
  AppError,
  NetworkError,
  APIError,
  NotFoundError,
  PlayerError,
  ValidationError,
  TimeoutError,
  RateLimitError,
  isAppError,
  getErrorMessage,
  ErrorCode,
} from './error-types';

describe('AppError', () => {
  it('should create error with message and code', () => {
    const error = new AppError('Test error', ErrorCode.UNKNOWN_ERROR);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(error.isOperational).toBe(true);
  });

  it('should include status code and context', () => {
    const context = { userId: '123' };
    const error = new AppError('Test', ErrorCode.API_ERROR, 500, context);
    expect(error.statusCode).toBe(500);
    expect(error.context).toEqual(context);
  });

  it('should serialize to JSON', () => {
    const error = new AppError('Test', ErrorCode.API_ERROR, 400);
    const json = error.toJSON();
    expect(json.name).toBe('AppError');
    expect(json.code).toBe(ErrorCode.API_ERROR);
    expect(json.message).toBe('Test');
    expect(json.statusCode).toBe(400);
  });
});

describe('NetworkError', () => {
  it('should create network error', () => {
    const error = new NetworkError();
    expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(error.getUserMessage()).toContain('internet connection');
  });

  it('should accept custom message', () => {
    const error = new NetworkError('Custom message');
    expect(error.message).toBe('Custom message');
  });
});

describe('APIError', () => {
  it('should create API error with status code', () => {
    const error = new APIError('API failed', 500);
    expect(error.code).toBe(ErrorCode.API_ERROR);
    expect(error.statusCode).toBe(500);
  });

  it('should provide appropriate user message for 404', () => {
    const error = new APIError('Not found', 404);
    expect(error.getUserMessage()).toContain('not found');
  });

  it('should provide appropriate user message for 429', () => {
    const error = new APIError('Rate limit', 429);
    expect(error.getUserMessage()).toContain('Too many requests');
  });

  it('should provide appropriate user message for 500+', () => {
    const error = new APIError('Server error', 500);
    expect(error.getUserMessage()).toContain('Server error');
  });
});

describe('NotFoundError', () => {
  it('should create not found error', () => {
    const error = new NotFoundError('Movie');
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain('Movie');
  });
});

describe('PlayerError', () => {
  it('should create player error', () => {
    const error = new PlayerError('Video load failed');
    expect(error.code).toBe(ErrorCode.PLAYER_ERROR);
    expect(error.getUserMessage()).toContain('video');
  });
});

describe('ValidationError', () => {
  it('should create validation error', () => {
    const error = new ValidationError('Invalid input');
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.statusCode).toBe(400);
  });
});

describe('TimeoutError', () => {
  it('should create timeout error', () => {
    const error = new TimeoutError();
    expect(error.code).toBe(ErrorCode.TIMEOUT_ERROR);
    expect(error.statusCode).toBe(408);
  });
});

describe('RateLimitError', () => {
  it('should create rate limit error', () => {
    const error = new RateLimitError();
    expect(error.code).toBe(ErrorCode.RATE_LIMIT);
    expect(error.statusCode).toBe(429);
  });

  it('should include retry after in message', () => {
    const error = new RateLimitError(60);
    expect(error.getUserMessage()).toContain('60');
  });
});

describe('isAppError', () => {
  it('should identify AppError instances', () => {
    const error = new AppError('Test', ErrorCode.UNKNOWN_ERROR);
    expect(isAppError(error)).toBe(true);
  });

  it('should identify subclass instances', () => {
    const error = new NetworkError();
    expect(isAppError(error)).toBe(true);
  });

  it('should reject regular errors', () => {
    const error = new Error('Regular error');
    expect(isAppError(error)).toBe(false);
  });

  it('should reject non-errors', () => {
    expect(isAppError('string')).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('should get user message from AppError', () => {
    const error = new NetworkError();
    expect(getErrorMessage(error)).toContain('internet connection');
  });

  it('should get message from regular Error', () => {
    const error = new Error('Regular error');
    expect(getErrorMessage(error)).toBe('Regular error');
  });

  it('should handle string errors', () => {
    expect(getErrorMessage('String error')).toBe('String error');
  });

  it('should handle unknown errors', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
    expect(getErrorMessage({})).toBe('An unexpected error occurred');
  });
});
