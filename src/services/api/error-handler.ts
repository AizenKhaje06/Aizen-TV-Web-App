export class ApiErrorHandler {
  static handle(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred';
  }

  static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('Network') || error.message.includes('connection');
    }
    return false;
  }

  static isAuthError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('[401]') || error.message.includes('Unauthorized');
    }
    return false;
  }

  static isNotFoundError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('[404]') || error.message.includes('Not Found');
    }
    return false;
  }

  static isServerError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('[500]') || error.message.includes('[502]') || error.message.includes('[503]');
    }
    return false;
  }

  static getUserFriendlyMessage(error: unknown): string {
    if (this.isNetworkError(error)) {
      return 'Unable to connect. Please check your internet connection.';
    }

    if (this.isAuthError(error)) {
      return 'Authentication failed. Please check your API key.';
    }

    if (this.isNotFoundError(error)) {
      return 'The requested content could not be found.';
    }

    if (this.isServerError(error)) {
      return 'Server is temporarily unavailable. Please try again later.';
    }

    return this.handle(error);
  }
}
