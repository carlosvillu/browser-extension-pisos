import type { Logger } from '../../infrastructure/logger';
import { PropertyType, type PropertyData } from '../interfaces';

export interface UrlGeneratorConfig {
  surfaceTolerancePercent: number;
  includePropertyType: boolean;
  includeGarage: boolean;
  includeElevator: boolean;
  includeRooms: boolean;
}

export const DEFAULT_URL_GENERATOR_CONFIG: UrlGeneratorConfig = {
  surfaceTolerancePercent: 0.15,
  includePropertyType: true,
  includeGarage: true,
  includeElevator: false,
  includeRooms: true,
};

export interface IUrlGenerator {
  generateRentalUrl(location: string | null, property: PropertyData): string;
  generateSaleUrl(location: string | null, property: PropertyData): string;
}

export class CrossReferenceUrlGenerator implements IUrlGenerator {
  private config: UrlGeneratorConfig;

  constructor(private logger: Logger, config?: Partial<UrlGeneratorConfig>) {
    this.config = { ...DEFAULT_URL_GENERATOR_CONFIG, ...config };
  }

  generateRentalUrl(location: string | null, property: PropertyData): string {
    const baseUrl = 'https://www.idealista.com/alquiler-viviendas';
    return this.buildPathBasedUrl(baseUrl, location, property);
  }

  generateSaleUrl(location: string | null, property: PropertyData): string {
    const baseUrl = 'https://www.idealista.com/venta-viviendas';
    return this.buildPathBasedUrl(baseUrl, location, property);
  }

  private buildPathBasedUrl(baseUrl: string, location: string | null, property: PropertyData): string {
    if (!location) {
      this.logger.error('No location provided for URL generation');
      return `${baseUrl}/`;
    }

    let url = `${baseUrl}/${location}/`;

    const characteristicFilters: string[] = [];

    if (this.config.includePropertyType && property.propertyType) {
      const typeFilter = this.mapPropertyTypeToFilter(property.propertyType);
      if (typeFilter) {
        characteristicFilters.push(typeFilter);
      }
    }

    if (this.config.includeGarage && property.hasGarage) {
      characteristicFilters.push('con-garaje');
    }

    if (this.config.includeElevator && property.hasElevator) {
      characteristicFilters.push('con-ascensor');
    }

    if (characteristicFilters.length > 0) {
      url += `${characteristicFilters.join(',')}/`;
    }

    const dimensionFilters: string[] = [];

    if (property.size && property.size > 0) {
      const tolerance = this.config.surfaceTolerancePercent;
      const minSize = Math.max(1, Math.floor(property.size * (1 - tolerance)));
      const maxSize = Math.ceil(property.size * (1 + tolerance));

      dimensionFilters.push(`metros-cuadrados-mas-de_${minSize}`);
      dimensionFilters.push(`metros-cuadrados-menos-de_${maxSize}`);
    }

    if (this.config.includeRooms && property.rooms && property.rooms > 0) {
      dimensionFilters.push(`${property.rooms}-habitaciones`);
    }

    if (dimensionFilters.length > 0) {
      url += `${dimensionFilters.join(',')}/`;
    }

    this.logger.log(`Generated URL: ${url}`);
    return url;
  }

  private mapPropertyTypeToFilter(type: PropertyType): string | null {
    switch (type) {
      case PropertyType.PENTHOUSE:
        return 'con-aticos';
      case PropertyType.DUPLEX:
        return 'con-duplex';
      case PropertyType.STUDIO:
        return 'con-estudios';
      case PropertyType.GROUND_FLOOR:
        return null;
      case PropertyType.FLAT:
      default:
        return null;
    }
  }
}
