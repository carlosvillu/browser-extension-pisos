import { UrlAnalysisResult, PropertyData } from '../domain/interfaces';
import { Logger } from '../infrastructure/logger';
import { IUrlAnalyzer, UrlAnalyzer } from '../domain/services/url-analyzer';
import { IPropertyExtractor, PropertyExtractor } from '../domain/services/property-extractor';
import { IRentalDataAnalyzer, RentalDataAnalyzer } from '../domain/services/rental-data-analyzer';
import { IProfitabilityCalculator, ProfitabilityCalculator } from '../domain/services/profitability-calculator';
import { IUrlGenerator, CrossReferenceUrlGenerator } from '../domain/services/url-generator';
import { IUIRenderer, InvestmentUIRenderer } from '../presentation/ui-renderer';
import { ICacheService } from '../domain/services/cache-service';
import { ContentCacheService } from '../domain/services/content-cache-service';
import { IErrorHandler, RobustErrorHandler } from '../domain/services/error-handler';
import { SimpleLazyLoader, IntersectionSimpleLazyLoader } from '../domain/services/simple-lazy-loader';

export interface IInvestmentAnalyzer {
  initialize(): void;
}

export class IdealistaInvestmentAnalyzer implements IInvestmentAnalyzer {
  private logger: Logger;
  private urlAnalyzer: IUrlAnalyzer;
  private propertyExtractor: IPropertyExtractor;
  private rentalDataAnalyzer: IRentalDataAnalyzer;
  private profitabilityCalculator: IProfitabilityCalculator;
  private urlGenerator: IUrlGenerator;
  private uiRenderer: IUIRenderer;
  private cacheService: ICacheService;
  private errorHandler: IErrorHandler;
  private lazyLoader: SimpleLazyLoader;

  constructor() {
    this.logger = new Logger('IdealistaInvestmentAnalyzer');
    this.urlAnalyzer = new UrlAnalyzer(this.logger);
    this.propertyExtractor = new PropertyExtractor(this.logger);
    this.cacheService = new ContentCacheService(this.logger);
    this.errorHandler = new RobustErrorHandler(this.logger);
    this.rentalDataAnalyzer = new RentalDataAnalyzer(
      this.logger, 
      this.propertyExtractor, 
      this.cacheService, 
      this.errorHandler
    );
    this.profitabilityCalculator = new ProfitabilityCalculator(this.logger);
    this.urlGenerator = new CrossReferenceUrlGenerator(this.logger);
    this.uiRenderer = new InvestmentUIRenderer(this.logger);
    this.lazyLoader = new IntersectionSimpleLazyLoader(this.logger);
  }

  initialize(): void {
    this.logger.log('Initializing Idealista Investment Analyzer');
    
    if (this.urlAnalyzer.isIdealistaPropertyPage()) {
      this.logger.log('Idealista property page detected');
      this.analyzeCurrentPage();
    } else {
      this.logger.log('Not an Idealista property page');
    }
  }

  private analyzeCurrentPage(): void {
    const urlAnalysis = this.urlAnalyzer.analyzeCurrentPage();
    
    if (urlAnalysis.searchType) {
      this.startPropertyAnalysis(urlAnalysis);
    }
  }

  private startPropertyAnalysis(urlAnalysis: UrlAnalysisResult): void {
    this.logger.log(`Starting analysis for ${urlAnalysis.searchType} properties in ${urlAnalysis.location}`);
    
    const properties = this.propertyExtractor.extractPropertiesFromPage();
    
    this.logger.log(`Found ${properties.length} properties on page`);
    
    if (properties.length > 0) {
      this.processProperties(properties, urlAnalysis);
    }
  }

  private processProperties(properties: PropertyData[], urlAnalysis: UrlAnalysisResult): void {
    this.logger.log('Processing properties for investment analysis');
    
    if (urlAnalysis.searchType !== 'venta') {
      this.logger.log('Skipping analysis - not a sale search');
      return;
    }

    // Use lazy loading to prevent overwhelming Idealista
    const propertyElements = properties.map(property => {
      const element = document.querySelector(`article.item[data-element-id="${property.id}"]`);
      return { property, element };
    }).filter(item => item.element !== null);

    if (propertyElements.length === 0) {
      this.logger.log('No property elements found, processing directly with delays');
      this.processBatch(properties, urlAnalysis);
      return;
    }

    const elements = propertyElements.map(item => item.element!);
    
    this.lazyLoader.observeElements(elements, (element) => {
      const propertyData = propertyElements.find(item => item.element === element)?.property;
      if (propertyData) {
        this.analyzePropertyProfitability(propertyData, urlAnalysis);
      }
    });
  }

  private async processBatch(properties: PropertyData[], urlAnalysis: UrlAnalysisResult): Promise<void> {
    this.logger.log('Processing properties in batch mode with delays');
    
    for (const property of properties) {
      await this.analyzePropertyProfitability(property, urlAnalysis);
      await this.delay(2000); // 2 second delay between properties to avoid rate limiting
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async analyzePropertyProfitability(property: PropertyData, urlAnalysis: UrlAnalysisResult): Promise<void> {
    this.logger.log(`Analyzing property ${property.id}: ${property.price}€ - ${property.rooms} hab., ${property.size}m²`);
    
    const context = {
      operation: 'analyzePropertyProfitability',
      propertyId: property.id,
      additionalData: { price: property.price, rooms: property.rooms, size: property.size }
    };
    
    try {
      await this.uiRenderer.renderLoadingBadge(property);
      
      const rentalUrl = this.urlGenerator.generateRentalUrl(urlAnalysis.location, property);
      this.logger.log(`Fetching rental data from: ${rentalUrl}`);
      
      const rentalData = await this.rentalDataAnalyzer.fetchRentalData(rentalUrl);
      
      if (rentalData && rentalData.sampleSize > 0) {
        const analysis = await this.profitabilityCalculator.calculateProfitability(property, rentalData);
        this.logger.log(`Profitability analysis for ${property.id}:`, analysis);
        
        await this.uiRenderer.renderBadge(property, analysis);
      } else {
        this.logger.log(`No rental data found for property ${property.id}`);
        this.handleMissingData(property);
      }
    } catch (error) {
      this.errorHandler.handleError(error as Error, context);
      this.handleAnalysisError(property);
    }
  }

  private handleMissingData(property: PropertyData): void {
    // Fallback: show a neutral badge indicating no data available
    this.uiRenderer.renderNoDataBadge(property);
  }

  private handleAnalysisError(property: PropertyData): void {
    // Fallback: remove loading badge and optionally show error badge
    this.uiRenderer.removeBadge(property);
  }
}