import { Logger } from '../../infrastructure/logger';
import { RentalData } from '../interfaces';

export interface ICacheService {
  get(key: string): Promise<RentalData | null>;
  set(key: string, data: RentalData, ttl?: number): Promise<void>;
  clear(): Promise<void>;
  cleanup(): Promise<void>;
}

interface CacheEntry {
  data: RentalData;
  timestamp: number;
  ttl: number;
}

export class RentalDataCacheService implements ICacheService {
  private readonly defaultTTL = 10 * 60 * 1000; // 10 minutes
  private readonly CACHE_PREFIX = 'rental_cache_';

  constructor(private logger: Logger) {}

  async get(key: string): Promise<RentalData | null> {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const result = await chrome.storage.session.get(cacheKey);
      const entry: CacheEntry | undefined = result[cacheKey];
      
      if (!entry) {
        return null;
      }

      if (Date.now() - entry.timestamp > entry.ttl) {
        await chrome.storage.session.remove(cacheKey);
        this.logger.log(`Cache entry expired for key: ${key}`);
        return null;
      }

      this.logger.log(`Cache hit for key: ${key}`);
      return entry.data;
    } catch (error) {
      this.logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, data: RentalData, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        ttl
      };
      
      await chrome.storage.session.set({ [cacheKey]: entry });
      this.logger.log(`Cached data for key: ${key} (TTL: ${ttl}ms)`);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const allData = await chrome.storage.session.get(null);
      const cacheKeys = Object.keys(allData).filter(key => key.startsWith(this.CACHE_PREFIX));
      
      if (cacheKeys.length > 0) {
        await chrome.storage.session.remove(cacheKeys);
      }
      
      this.logger.log('Cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
    }
  }

  async cleanup(): Promise<void> {
    try {
      const allData = await chrome.storage.session.get(null);
      const now = Date.now();
      const expiredKeys: string[] = [];
      
      for (const [key, value] of Object.entries(allData)) {
        if (key.startsWith(this.CACHE_PREFIX)) {
          const entry = value as CacheEntry;
          if (now - entry.timestamp > entry.ttl) {
            expiredKeys.push(key);
          }
        }
      }
      
      if (expiredKeys.length > 0) {
        await chrome.storage.session.remove(expiredKeys);
        this.logger.log(`Cleaned up ${expiredKeys.length} expired cache entries`);
      }
    } catch (error) {
      this.logger.error('Error during cache cleanup:', error);
    }
  }
}