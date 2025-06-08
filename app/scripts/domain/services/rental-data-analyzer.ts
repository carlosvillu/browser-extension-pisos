import { RentalData, PropertyData } from '../interfaces';
import { Logger } from '../../infrastructure/logger';
import { IPropertyExtractor } from './property-extractor';

export interface IRentalDataAnalyzer {
  fetchRentalData(rentalUrl: string): Promise<RentalData | null>;
}

export class RentalDataAnalyzer implements IRentalDataAnalyzer {
  constructor(
    private logger: Logger,
    private propertyExtractor: IPropertyExtractor
  ) {}

  async fetchRentalData(rentalUrl: string): Promise<RentalData | null> {
    try {
      this.logger.log(`Fetching rental data from: ${rentalUrl}`);
      
      const response = await fetch(rentalUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.5',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        this.logger.error(`Failed to fetch rental data: ${response.status}`);
        return null;
      }

      const html = await response.text();
      return this.parseRentalDataFromHtml(html);
      
    } catch (error) {
      this.logger.error('Error fetching rental data', error);
      return null;
    }
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