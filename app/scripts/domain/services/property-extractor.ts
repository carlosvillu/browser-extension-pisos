import { PropertyData } from '../interfaces';
import { Logger } from '../../infrastructure/logger';

export interface IPropertyExtractor {
  extractPropertiesFromPage(): PropertyData[];
  extractPropertiesFromDocument(doc: Document): PropertyData[];
}

export class PropertyExtractor implements IPropertyExtractor {
  constructor(private logger: Logger) {}

  extractPropertiesFromPage(): PropertyData[] {
    const properties: PropertyData[] = [];
    const propertyElements = document.querySelectorAll('article.item[data-element-id]');
    
    this.logger.log(`Found ${propertyElements.length} property elements on page`);

    propertyElements.forEach(element => {
      try {
        const property = this.extractPropertyData(element as HTMLElement);
        if (property) {
          properties.push(property);
        }
      } catch (error) {
        this.logger.error('Error extracting property data', error);
      }
    });

    return properties;
  }

  extractPropertiesFromDocument(doc: Document): PropertyData[] {
    const properties: PropertyData[] = [];
    const propertyElements = doc.querySelectorAll('article.item[data-element-id]');
    
    propertyElements.forEach(element => {
      try {
        const property = this.extractPropertyDataFromElement(element as HTMLElement);
        if (property) {
          properties.push(property);
        }
      } catch (error) {
        this.logger.error('Error extracting property data from element', error);
      }
    });

    return properties;
  }

  extractPropertyData(element: HTMLElement): PropertyData | null {
    return this.extractPropertyDataFromElement(element);
  }

  private extractPropertyDataFromElement(element: HTMLElement): PropertyData | null {
    const id = element.getAttribute('data-element-id');
    if (!id) return null;

    const priceElement = element.querySelector('.item-price');
    const priceText = priceElement?.textContent?.replace(/[€\s]/g, '').replace('.', '') || '0';
    const price = parseInt(priceText, 10) || 0;

    const linkElement = element.querySelector('.item-link') as HTMLAnchorElement;
    const title = linkElement?.textContent?.trim() || '';
    const url = linkElement?.href || '';

    const details = element.querySelectorAll('.item-detail');
    let rooms: number | null = null;
    let size: number | null = null;
    let floor: string | null = null;

    details.forEach(detail => {
      const text = detail.textContent?.trim() || '';
      
      if (text.includes('hab.')) {
        const roomMatch = text.match(/(\d+)\s*hab\./);
        rooms = roomMatch ? parseInt(roomMatch[1], 10) : null;
      } else if (text.includes('m²')) {
        const sizeMatch = text.match(/(\d+)\s*m²/);
        size = sizeMatch ? parseInt(sizeMatch[1], 10) : null;
      } else if (text.includes('Planta') || text.includes('Bajo')) {
        floor = text;
      }
    });

    const hasGarage = !!element.querySelector('.item-parking');

    const descriptionElement = element.querySelector('.item-description .ellipsis');
    const description = descriptionElement?.textContent?.trim() || '';

    const tagElements = element.querySelectorAll('.listing-tags');
    const tags: string[] = Array.from(tagElements).map(tag => tag.textContent?.trim() || '');

    const location = this.extractLocationFromTitle(title);

    return {
      id,
      title,
      price,
      rooms,
      size,
      floor,
      hasGarage,
      description,
      url,
      tags,
      location
    };
  }

  private extractLocationFromTitle(title: string): string {
    const parts = title.split(',');
    if (parts.length >= 2) {
      return parts[parts.length - 2].trim();
    }
    return '';
  }
}