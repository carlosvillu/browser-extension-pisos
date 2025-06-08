import { UrlAnalysisResult, PropertyData } from '../domain/interfaces';
import { Logger } from '../infrastructure/logger';
import { IUrlAnalyzer, UrlAnalyzer } from '../domain/services/url-analyzer';
import { IPropertyExtractor, PropertyExtractor } from '../domain/services/property-extractor';
import { IRentalDataAnalyzer, RentalDataAnalyzer } from '../domain/services/rental-data-analyzer';
import { IProfitabilityCalculator, ProfitabilityCalculator } from '../domain/services/profitability-calculator';
import { IUrlGenerator, CrossReferenceUrlGenerator } from '../domain/services/url-generator';
import { IUIRenderer, InvestmentUIRenderer } from '../presentation/ui-renderer';

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

  constructor() {
    this.logger = new Logger('IdealistaInvestmentAnalyzer');
    this.urlAnalyzer = new UrlAnalyzer(this.logger);
    this.propertyExtractor = new PropertyExtractor(this.logger);
    this.rentalDataAnalyzer = new RentalDataAnalyzer(this.logger, this.propertyExtractor);
    this.profitabilityCalculator = new ProfitabilityCalculator(this.logger);
    this.urlGenerator = new CrossReferenceUrlGenerator(this.logger);
    this.uiRenderer = new InvestmentUIRenderer(this.logger);
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

  private async processProperties(properties: PropertyData[], urlAnalysis: UrlAnalysisResult): Promise<void> {
    this.logger.log('Processing properties for investment analysis');
    
    if (urlAnalysis.searchType !== 'venta') {
      this.logger.log('Skipping analysis - not a sale search');
      return;
    }

    for (const property of properties) {
      await this.analyzePropertyProfitability(property, urlAnalysis);
      await this.delay(1000);
    }
  }

  private async analyzePropertyProfitability(property: PropertyData, urlAnalysis: UrlAnalysisResult): Promise<void> {
    this.logger.log(`Analyzing property ${property.id}: ${property.price}€ - ${property.rooms} hab., ${property.size}m²`);
    
    try {
      this.uiRenderer.renderLoadingBadge(property);
      
      const rentalUrl = this.urlGenerator.generateRentalUrl(urlAnalysis.location, property);
      this.logger.log(`Fetching rental data from: ${rentalUrl}`);
      
      const rentalData = await this.rentalDataAnalyzer.fetchRentalData(rentalUrl);
      
      if (rentalData && rentalData.sampleSize > 0) {
        const analysis = this.profitabilityCalculator.calculateProfitability(property, rentalData);
        this.logger.log(`Profitability analysis for ${property.id}:`, analysis);
        
        this.uiRenderer.renderBadge(property, analysis);
      } else {
        this.logger.log(`No rental data found for property ${property.id}`);
        this.uiRenderer.removeBadge(property);
      }
    } catch (error) {
      this.logger.error(`Error analyzing property ${property.id}`, error);
      this.uiRenderer.removeBadge(property);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}