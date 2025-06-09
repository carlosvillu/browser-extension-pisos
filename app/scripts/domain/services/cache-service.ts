import { Logger } from '../../infrastructure/logger';
import { RentalData } from '../interfaces';

export interface ICacheService {
  get(key: string): RentalData | null;
  set(key: string, data: RentalData, ttl?: number): void;
  clear(): void;
  cleanup(): void;
}

interface CacheEntry {
  data: RentalData;
  timestamp: number;
  ttl: number;
}

export class RentalDataCacheService implements ICacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 10 * 60 * 1000; // 10 minutes

  constructor(private logger: Logger) {
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  get(key: string): RentalData | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.logger.log(`Cache entry expired for key: ${key}`);
      return null;
    }

    this.logger.log(`Cache hit for key: ${key}`);
    return entry.data;
  }

  set(key: string, data: RentalData, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.logger.log(`Cached data for key: ${key} (TTL: ${ttl}ms)`);
  }

  clear(): void {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }

  cleanup(): void {
    const now = Date.now();
    const initialSize = this.cache.size;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
    
    const cleanedCount = initialSize - this.cache.size;
    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} expired cache entries`);
    }
  }
}