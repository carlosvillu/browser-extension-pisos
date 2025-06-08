import { PropertyData, UrlAnalysisResult } from '../interfaces';
import { Logger } from '../../infrastructure/logger';
import { IUrlGenerator } from './url-generator';

export interface PropertyBatch {
  properties: PropertyData[];
  rentalUrl: string;
  cacheKey: string;
}

export interface IBatchProcessor {
  createBatches(properties: PropertyData[], urlAnalysis: UrlAnalysisResult): PropertyBatch[];
}

export class PropertyBatchProcessor implements IBatchProcessor {
  constructor(
    private logger: Logger,
    private urlGenerator: IUrlGenerator
  ) {}

  createBatches(properties: PropertyData[], urlAnalysis: UrlAnalysisResult): PropertyBatch[] {
    const batches = new Map<string, PropertyData[]>();
    
    // Group properties by similar search criteria to minimize HTTP requests
    properties.forEach(property => {
      const rentalUrl = this.urlGenerator.generateRentalUrl(urlAnalysis.location, property);
      const cacheKey = this.createCacheKey(rentalUrl, property);
      
      if (!batches.has(cacheKey)) {
        batches.set(cacheKey, []);
      }
      batches.get(cacheKey)!.push(property);
    });
    
    const result = Array.from(batches.entries()).map(([cacheKey, properties]) => {
      const referenceProperty = properties[0];
      const rentalUrl = this.urlGenerator.generateRentalUrl(urlAnalysis.location, referenceProperty);
      
      return {
        properties,
        rentalUrl,
        cacheKey
      };
    });
    
    this.logger.log(`Created ${result.length} batches from ${properties.length} properties`);
    return result;
  }

  private createCacheKey(url: string, property: PropertyData): string {
    // Group by location and general property characteristics
    // Remove specific property IDs to enable batching
    try {
      const urlObj = new URL(url);
      
      // Keep location and general filters, remove property-specific params
      const relevantParams = ['location', 'rooms', 'bathrooms', 'minSize', 'maxSize', 'minPrice', 'maxPrice'];
      const filteredParams = new URLSearchParams();
      
      relevantParams.forEach(param => {
        const value = urlObj.searchParams.get(param);
        if (value !== null) {
          filteredParams.set(param, value);
        }
      });
      
      // Add property characteristics to group similar properties
      const roomsGroup = this.getRoomsGroup(property.rooms || 0);
      const sizeGroup = this.getSizeGroup(property.size || 0);
      
      return `${urlObj.pathname}?${filteredParams.toString()}&rooms_group=${roomsGroup}&size_group=${sizeGroup}`;
    } catch (error) {
      this.logger.error('Error creating cache key', error);
      return url;
    }
  }

  private getRoomsGroup(rooms: number): string {
    if (rooms <= 1) return '1';
    if (rooms <= 2) return '2';
    if (rooms <= 3) return '3';
    return '4+';
  }

  private getSizeGroup(size: number): string {
    if (size <= 50) return 'small';
    if (size <= 80) return 'medium';
    if (size <= 120) return 'large';
    return 'xlarge';
  }
}