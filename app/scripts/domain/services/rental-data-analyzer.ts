import { RentalData, PropertyData } from '../interfaces';
import { Logger } from '../../infrastructure/logger';
import { IPropertyExtractor } from './property-extractor';
import { ICacheService } from './cache-service';
import { IErrorHandler, ErrorContext } from './error-handler';

export interface IRentalDataAnalyzer {
  fetchRentalData(rentalUrl: string): Promise<RentalData | null>;
}

export class RentalDataAnalyzer implements IRentalDataAnalyzer {
  constructor(
    private logger: Logger,
    private propertyExtractor: IPropertyExtractor,
    private cacheService: ICacheService,
    private errorHandler: IErrorHandler
  ) {}

  async fetchRentalData(rentalUrl: string): Promise<RentalData | null> {
    const cacheKey = this.createCacheKey(rentalUrl);
    
    // Check cache first
    const cachedData = this.cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    return this.fetchWithRetry(rentalUrl, cacheKey, 1);
  }

  private async fetchWithRetry(rentalUrl: string, cacheKey: string, attempt: number): Promise<RentalData | null> {
    const context: ErrorContext = {
      operation: 'fetchRentalData',
      url: rentalUrl
    };

    try {
      this.logger.log(`Fetching rental data (attempt ${attempt}): ${rentalUrl}`);
      
      const response = await fetch(rentalUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.5',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch rental data`);
      }

      const html = await response.text();
      const data = this.parseRentalDataFromHtml(html);
      
      if (data) {
        this.cacheService.set(cacheKey, data);
      }
      
      return data;
      
    } catch (error) {
      this.errorHandler.handleError(error as Error, context);
      
      if (this.errorHandler.shouldRetry(error as Error, attempt)) {
        const delay = this.errorHandler.getRetryDelay(attempt);
        this.logger.log(`Retrying in ${delay}ms (attempt ${attempt + 1})`);
        
        await this.delay(delay);
        return this.fetchWithRetry(rentalUrl, cacheKey, attempt + 1);
      }
      
      return null;
    }
  }

  private createCacheKey(url: string): string {
    // Create a normalized cache key from the URL
    try {
      const urlObj = new URL(url);
      return `${urlObj.pathname}${urlObj.search}`;
    } catch {
      return url;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private parseRentalDataFromHtml(html: string): RentalData | null {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const properties = this.propertyExtractor.extractPropertiesFromDocument(doc);
      
      if (properties.length === 0) {
        this.logger.log('No rental properties found in response');
        return null;
      }

      const prices = properties
        .map(p => p.price)
        .filter(price => price > 0)
        .sort((a, b) => a - b);

      if (prices.length === 0) {
        this.logger.log('No valid prices found in rental properties');
        return null;
      }

      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const minPrice = prices[0];
      const maxPrice = prices[prices.length - 1];

      this.logger.log(`Rental analysis: ${prices.length} properties, avg: ${averagePrice}€`);

      return {
        averagePrice: Math.round(averagePrice),
        minPrice,
        maxPrice,
        sampleSize: prices.length,
        properties
      };

    } catch (error) {
      this.logger.error('Error parsing rental data from HTML', error);
      return null;
    }
  }
}