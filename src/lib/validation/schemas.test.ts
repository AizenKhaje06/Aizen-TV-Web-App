/**
 * Validation Schema Tests
 */

import { describe, it, expect } from 'vitest';
import {
  mediaIdSchema,
  searchQuerySchema,
  seasonSchema,
  episodeSchema,
  safeValidate,
  validate,
} from './schemas';

describe('mediaIdSchema', () => {
  it('should accept valid positive integers', () => {
    expect(mediaIdSchema.parse(123)).toBe(123);
    expect(mediaIdSchema.parse('456')).toBe(456);
  });

  it('should reject negative numbers', () => {
    expect(() => mediaIdSchema.parse(-1)).toThrow();
  });

  it('should reject zero', () => {
    expect(() => mediaIdSchema.parse(0)).toThrow();
  });

  it('should reject non-numeric strings', () => {
    expect(() => mediaIdSchema.parse('abc')).toThrow();
  });
});

describe('searchQuerySchema', () => {
  it('should accept valid search queries', () => {
    expect(searchQuerySchema.parse('Inception')).toBe('Inception');
    expect(searchQuerySchema.parse('  The Matrix  ')).toBe('The Matrix');
  });

  it('should remove HTML tags', () => {
    expect(searchQuerySchema.parse('Test<script>')).toBe('Testscript');
    expect(searchQuerySchema.parse('Query>test')).toBe('Querytest');
  });

  it('should reject empty strings', () => {
    expect(() => searchQuerySchema.parse('')).toThrow();
    expect(() => searchQuerySchema.parse('   ')).toThrow();
  });

  it('should reject queries that are too long', () => {
    const longQuery = 'a'.repeat(101);
    expect(() => searchQuerySchema.parse(longQuery)).toThrow();
  });
});

describe('seasonSchema', () => {
  it('should accept valid season numbers', () => {
    expect(seasonSchema.parse(0)).toBe(0);
    expect(seasonSchema.parse(1)).toBe(1);
    expect(seasonSchema.parse('5')).toBe(5);
  });

  it('should reject negative numbers', () => {
    expect(() => seasonSchema.parse(-1)).toThrow();
  });
});

describe('episodeSchema', () => {
  it('should accept valid episode numbers', () => {
    expect(episodeSchema.parse(1)).toBe(1);
    expect(episodeSchema.parse('10')).toBe(10);
  });

  it('should reject zero and negative numbers', () => {
    expect(() => episodeSchema.parse(0)).toThrow();
    expect(() => episodeSchema.parse(-1)).toThrow();
  });
});

describe('safeValidate', () => {
  it('should return success for valid data', () => {
    const result = safeValidate(mediaIdSchema, 123);
    expect(result.success).toBe(true);
    expect(result.data).toBe(123);
    expect(result.error).toBeUndefined();
  });

  it('should return error for invalid data', () => {
    const result = safeValidate(mediaIdSchema, -1);
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
  });
});

describe('validate', () => {
  it('should return parsed data for valid input', () => {
    const result = validate(mediaIdSchema, 123);
    expect(result).toBe(123);
  });

  it('should throw error for invalid input', () => {
    expect(() => validate(mediaIdSchema, -1)).toThrow();
  });

  it('should use custom error message', () => {
    expect(() => validate(mediaIdSchema, -1, 'Custom error')).toThrow('Custom error');
  });
});
