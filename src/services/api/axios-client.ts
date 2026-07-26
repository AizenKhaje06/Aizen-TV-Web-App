import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/config/env';
import { ApiError } from '@/types/api.types';

class AxiosClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: env.NEXT_PUBLIC_TMDB_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add API key to all requests
        config.params = {
          ...config.params,
          api_key: env.NEXT_PUBLIC_TMDB_API_KEY,
        };
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        const customError = this.handleError(error);
        return Promise.reject(customError);
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): Error {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      const message = data?.status_message || 'An error occurred';
      return new Error(`[${status}] ${message}`);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.');
    } else {
      // Request setup error
      return new Error(error.message || 'Request failed');
    }
  }

  public getClient(): AxiosInstance {
    return this.instance;
  }

  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }
}

export const axiosClient = new AxiosClient();
