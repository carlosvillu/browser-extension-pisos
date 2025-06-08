import { UrlAnalysisResult } from '../interfaces';
import { Logger } from '../../infrastructure/logger';

export interface IUrlAnalyzer {
  analyzeCurrentPage(): UrlAnalysisResult;
  isIdealistaPropertyPage(): boolean;
}

export class UrlAnalyzer implements IUrlAnalyzer {
  constructor(private logger: Logger) {}

  analyzeCurrentPage(): UrlAnalysisResult {
    const url = window.location.href;
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    let searchType: 'venta' | 'alquiler' | null = null;
    if (pathname.includes('/venta-viviendas/')) {
      searchType = 'venta';
    } else if (pathname.includes('/alquiler-viviendas/')) {
      searchType = 'alquiler';
    }
    
    const location = this.extractLocationFromUrl(pathname);
    const hasFilters = searchParams.toString().length > 0;
    
    const result = {
      isIdealista: this.isIdealistaPropertyPage(),
      searchType,
      location,
      hasFilters
    };

    this.logger.log('URL Analysis:', result);
    return result;
  }

  isIdealistaPropertyPage(): boolean {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    return hostname === 'www.idealista.com' && 
           (pathname.includes('/venta-viviendas/') || pathname.includes('/alquiler-viviendas/'));
  }

  private extractLocationFromUrl(pathname: string): string | null {
    const match = pathname.match(/\/(venta|alquiler)-viviendas\/([^/]+)/);
    return match ? match[2] : null;
  }
}