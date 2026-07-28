/**
 * Validation Schemas
 * 
 * Zod schemas for validating user inputs, URL parameters, and API responses.
 * Provides type-safe validation with helpful error messages.
 */

import { z } from 'zod';

/**
 * Media ID validation (TMDB IDs are positive integers)
 */
export const mediaIdSchema = z
  .number()
  .int()
  .positive('Media ID must be a positive integer')
  .or(
    z.string().regex(/^\d+$/, 'Media ID must be a numeric string').transform(Number)
  );

/**
 * Season number validation
 */
export const seasonSchema = z
  .number()
  .int()
  .nonnegative('Season must be a non-negative integer')
  .or(
    z.string().regex(/^\d+$/, 'Season must be a numeric string').transform(Number)
  );

/**
 * Episode number validation
 */
export const episodeSchema = z
  .number()
  .int()
  .positive('Episode must be a positive integer')
  .or(
    z.string().regex(/^\d+$/, 'Episode must be a numeric string').transform(Number)
  );

/**
 * Search query validation
 */
export const searchQuerySchema = z
  .string()
  .trim() // Trim first
  .min(1, 'Search query cannot be empty') // Then validate length
  .max(100, 'Search query is too long')
  .transform((val) => val.replace(/[<>]/g, '')); // Remove potential HTML

/**
 * Page number validation
 */
export const pageSchema = z
  .number()
  .int()
  .positive('Page must be a positive integer')
  .max(1000, 'Page number is too large')
  .or(
    z.string().regex(/^\d+$/, 'Page must be a numeric string').transform(Number)
  )
  .optional()
  .default(1);

/**
 * Movie route params validation
 */
export const movieParamsSchema = z.object({
  id: mediaIdSchema,
});

/**
 * TV route params validation
 */
export const tvParamsSchema = z.object({
  id: mediaIdSchema,
});

/**
 * TV episode route params validation
 */
export const tvEpisodeParamsSchema = z.object({
  id: mediaIdSchema,
  season: seasonSchema,
  episode: episodeSchema,
});

/**
 * Search params validation
 */
export const searchParamsSchema = z.object({
  q: searchQuerySchema,
  page: pageSchema,
});

/**
 * URL validation
 */
export const urlSchema = z.string().url('Invalid URL format');

/**
 * Safe parse with validation error handling
 */
export function safeValidate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): {
  success: boolean;
  data?: z.infer<T>;
  error?: string;
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const firstError = result.error.errors[0];
  return {
    success: false,
    error: firstError?.message || 'Validation failed',
  };
}

/**
 * Validate and throw on error
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  errorMessage?: string
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(errorMessage || firstError?.message || 'Validation failed');
    }
    throw error;
  }
}
