/**
 * Environment Variable Validation
 * 
 * Validates and provides type-safe access to environment variables.
 * Fails fast at startup if required variables are missing.
 */

import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().optional().default('MyStream'),
  
  // TMDB API
  NEXT_PUBLIC_TMDB_API_KEY: z.string().min(1, 'TMDB API key is required'),
  NEXT_PUBLIC_TMDB_API_URL: z.string().url().optional().default('https://api.themoviedb.org/3'),
  NEXT_PUBLIC_TMDB_IMAGE_URL: z.string().url().optional().default('https://image.tmdb.org/t/p'),
  
  // Player configuration
  NEXT_PUBLIC_PLAYER_BASE_URL: z.string().url().optional().default('https://vidsrc2.ru/embed'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
      NEXT_PUBLIC_TMDB_API_URL: process.env.NEXT_PUBLIC_TMDB_API_URL,
      NEXT_PUBLIC_TMDB_IMAGE_URL: process.env.NEXT_PUBLIC_TMDB_IMAGE_URL,
      NEXT_PUBLIC_PLAYER_BASE_URL: process.env.NEXT_PUBLIC_PLAYER_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `  - ${err.path.join('.')}: ${err.message}`);
      throw new Error(
        `Invalid environment variables:\n${missingVars.join('\n')}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Export type for TypeScript
export type Env = z.infer<typeof envSchema>;

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
