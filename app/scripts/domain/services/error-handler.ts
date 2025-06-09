import { Logger } from '../../infrastructure/logger';

export interface ErrorContext {
  operation: string;
  propertyId?: string;
  url?: string;
  additionalData?: Record<string, any>;
}

export interface IErrorHandler {
  handleError(error: Error, context: ErrorContext): void;
  shouldRetry(error: Error, attemptCount: number): boolean;
  getRetryDelay(attemptCount: number): number;
}

export class RobustErrorHandler implements IErrorHandler {
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000; // 1 second
  private errorCounts = new Map<string, number>();

  constructor(private logger: Logger) {}

  handleError(error: Error, context: ErrorContext): void {
    const errorKey = `${context.operation}-${error.name}`;
    const currentCount = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, currentCount + 1);

    this.logger.error(`Error in ${context.operation}`, {
      error: error.message,
      stack: error.stack,
      context,
      errorCount: currentCount + 1
    });

    // Log specific error patterns for debugging
    if (error.message.includes('fetch')) {
      this.logger.error('Network error detected', {
        url: context.url,
        propertyId: context.propertyId
      });
    } else if (error.message.includes('parse') || error.message.includes('DOM')) {
      this.logger.error('Parsing error detected', {
        operation: context.operation,
        additionalData: context.additionalData
      });
    }
  }

  shouldRetry(error: Error, attemptCount: number): boolean {
    if (attemptCount >= this.maxRetries) {
      return false;
    }

    // Retry on network errors
    if (error.message.includes('fetch') || 
        error.message.includes('network') || 
        error.message.includes('timeout')) {
      return true;
    }

    // Retry on temporary server errors (5xx)
    if (error.message.includes('500') || 
        error.message.includes('502') || 
        error.message.includes('503') || 
        error.message.includes('504')) {
      return true;
    }

    // Don't retry on client errors (4xx) or parsing errors
    return false;
  }

  getRetryDelay(attemptCount: number): number {
    // Exponential backoff with jitter
    const delay = this.baseDelay * Math.pow(2, attemptCount);
    const jitter = Math.random() * 0.1 * delay; // 10% jitter
    return delay + jitter;
  }

  getErrorStats(): Record<string, number> {
    return Object.fromEntries(this.errorCounts);
  }

  clearErrorStats(): void {
    this.errorCounts.clear();
    this.logger.log('Error statistics cleared');
  }
}