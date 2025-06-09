import type { Logger } from '../../infrastructure/logger';
import type { UrlAnalysisResult } from '../interfaces';

export interface IUrlAnalyzer {
  analyzeCurrentPage(): UrlAnalysisResult;
  analyzeUrl(url: URL): UrlAnalysisResult;
  isIdealistaPropertyPage(): boolean;
}

export class UrlAnalyzer implements IUrlAnalyzer {
  constructor(private logger: Logger) {}

  analyzeCurrentPage(): UrlAnalysisResult {
    const url = new URL(window.location.href);
    return this.analyzeUrl(url);
  }

  analyzeUrl(url: URL): UrlAnalysisResult {
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    let searchType: 'venta' | 'alquiler' | null = null;
    if (pathname.includes('/venta-viviendas/')) {
      searchType = 'venta';
    } else if (pathname.includes('/alquiler-viviendas/')) {
      searchType = 'alquiler';
    }

    const location = this.extractLocationFromUrl(pathname);
    const hasFilters = searchParams.toString().length > 0;
    const isIdealista =
      url.hostname === 'www.idealista.com' &&
      (pathname.includes('/venta-viviendas/') || pathname.includes('/alquiler-viviendas/'));

    const result = {
      isIdealista,
      searchType,
      location,
      hasFilters,
    };

    this.logger.log('URL Analysis:', result);
    return result;
  }

  isIdealistaPropertyPage(): boolean {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    return (
      hostname === 'www.idealista.com' &&
      (pathname.includes('/venta-viviendas/') || pathname.includes('/alquiler-viviendas/'))
    );
  }

  private extractLocationFromUrl(pathname: string): string | null {
    const match = pathname.match(/\/(venta|alquiler)-viviendas\/([^/]+)/);
    return match ? match[2] : null;
  }
}
