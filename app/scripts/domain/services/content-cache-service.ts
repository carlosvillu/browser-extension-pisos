import type { Logger } from '../../infrastructure/logger';
import type { RentalData } from '../interfaces';
import type { ICacheService } from './cache-service';

export class ContentCacheService implements ICacheService {
  constructor(private logger: Logger) {}

  async get(key: string): Promise<RentalData | null> {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CACHE_GET',
        key,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error) {
      this.logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, data: RentalData, ttl?: number): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CACHE_SET',
        key,
        data,
        ttl,
      });

      if (!response.success) {
        throw new Error(response.error);
      }
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CACHE_CLEAR',
      });

      if (!response.success) {
        throw new Error(response.error);
      }
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
    }
  }

  async cleanup(): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CACHE_CLEANUP',
      });

      if (!response.success) {
        throw new Error(response.error);
      }
    } catch (error) {
      this.logger.error('Error during cache cleanup:', error);
    }
  }
}
