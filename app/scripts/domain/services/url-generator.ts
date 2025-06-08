import { PropertyData } from '../interfaces';
import { Logger } from '../../infrastructure/logger';

export interface IUrlGenerator {
  generateRentalUrl(location: string | null, property: PropertyData): string;
  generateSaleUrl(location: string | null, property: PropertyData): string;
}

export class CrossReferenceUrlGenerator implements IUrlGenerator {
  constructor(private logger: Logger) {}

  generateRentalUrl(location: string | null, property: PropertyData): string {
    const baseUrl = 'https://www.idealista.com/alquiler-viviendas';
    return this.buildUrl(baseUrl, location, property);
  }

  generateSaleUrl(location: string | null, property: PropertyData): string {
    const baseUrl = 'https://www.idealista.com/venta-viviendas';
    return this.buildUrl(baseUrl, location, property);
  }

  private buildUrl(baseUrl: string, location: string | null, property: PropertyData): string {
    if (!location) {
      this.logger.error('No location provided for URL generation');
      return `${baseUrl}/`;
    }

    let url = `${baseUrl}/${location}/`;
    
    const params = new URLSearchParams();
    
    if (property.rooms && property.rooms > 0) {
      params.append('habitaciones', property.rooms.toString());
    }
    
    if (property.size && property.size > 0) {
      const minSize = Math.max(1, property.size - 20);
      const maxSize = property.size + 20;
      params.append('superficie', `${minSize}-${maxSize}`);
    }

    const paramString = params.toString();
    if (paramString) {
      url += `?${paramString}`;
    }

    return url;
  }
}