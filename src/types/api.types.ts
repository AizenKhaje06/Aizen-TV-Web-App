export interface ApiError {
  status_code: number;
  status_message: string;
  success: false;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  language?: string;
}

export interface MovieQueryParams extends PaginationParams {
  with_genres?: string;
  sort_by?: string;
  year?: number;
}

export interface TVQueryParams extends PaginationParams {
  with_genres?: string;
  sort_by?: string;
  first_air_date_year?: number;
}

export interface SearchParams extends PaginationParams {
  query: string;
  include_adult?: boolean;
}

export type TimeWindow = 'day' | 'week';

export interface RequestConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}
