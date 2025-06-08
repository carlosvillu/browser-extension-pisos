import { Logger } from '../../infrastructure/logger';
import { PropertyData, RentalData, ProfitabilityAnalysis } from '../interfaces';
import { IProfitabilityCalculator } from './profitability-calculator';
import { IUrlAnalyzer } from './url-analyzer';

export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
}

export interface ITestingValidator {
  validateUrlAnalysis(): Promise<TestResult[]>;
  validateProfitabilityCalculations(): Promise<TestResult[]>;
  validateSearchTypes(): Promise<TestResult[]>;
  runAllTests(): Promise<TestResult[]>;
}

export class InvestmentTestingValidator implements ITestingValidator {
  constructor(
    private logger: Logger,
    private profitabilityCalculator: IProfitabilityCalculator,
    private urlAnalyzer: IUrlAnalyzer
  ) {}

  async validateUrlAnalysis(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Test 1: Validate sale URL detection
    const saleUrls = [
      'https://www.idealista.com/venta-viviendas/madrid/madrid/',
      'https://www.idealista.com/venta-viviendas/barcelona/barcelona/',
      'https://www.idealista.com/venta-viviendas/valencia/valencia/'
    ];

    for (const url of saleUrls) {
      try {
        // Temporarily change current URL for testing
        const originalUrl = window.location.href;
        Object.defineProperty(window, 'location', {
          value: { href: url },
          writable: true
        });

        const analysis = this.urlAnalyzer.analyzeCurrentPage();
        
        results.push({
          testName: `Sale URL Detection: ${url}`,
          passed: analysis.searchType === 'venta',
          message: analysis.searchType === 'venta' 
            ? 'Correctly identified as sale search' 
            : `Expected 'venta', got '${analysis.searchType}'`
        });

        // Restore original URL
        Object.defineProperty(window, 'location', {
          value: { href: originalUrl },
          writable: true
        });
      } catch (error) {
        results.push({
          testName: `Sale URL Detection: ${url}`,
          passed: false,
          message: `Error during test: ${error}`
        });
      }
    }

    return results;
  }

  async validateProfitabilityCalculations(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Test data for validation
    const testCases = [
      {
        name: 'High Yield Property',
        property: {
          id: 'test-1',
          price: 100000,
          rooms: 2,
          size: 60,
          title: 'Test Property'
        } as PropertyData,
        rentalData: {
          averagePrice: 800,
          minPrice: 700,
          maxPrice: 900,
          sampleSize: 10,
          properties: []
        } as RentalData,
        expectedYield: { min: 8, max: 10 }
      },
      {
        name: 'Low Yield Property',
        property: {
          id: 'test-2',
          price: 300000,
          rooms: 3,
          size: 80,
          title: 'Test Property 2'
        } as PropertyData,
        rentalData: {
          averagePrice: 1200,
          minPrice: 1000,
          maxPrice: 1400,
          sampleSize: 5,
          properties: []
        } as RentalData,
        expectedYield: { min: 3, max: 5 }
      }
    ];

    for (const testCase of testCases) {
      try {
        const analysis = this.profitabilityCalculator.calculateProfitability(
          testCase.property,
          testCase.rentalData
        );

        const isYieldValid = analysis.netYield >= testCase.expectedYield.min && 
                            analysis.netYield <= testCase.expectedYield.max;

        results.push({
          testName: `Profitability Calculation: ${testCase.name}`,
          passed: isYieldValid,
          message: isYieldValid 
            ? `Net yield ${analysis.netYield}% is within expected range` 
            : `Net yield ${analysis.netYield}% is outside expected range ${testCase.expectedYield.min}-${testCase.expectedYield.max}%`,
          details: {
            calculated: analysis,
            expected: testCase.expectedYield
          }
        });

        // Validate calculation components
        const hasValidComponents = 
          analysis.purchasePrice > 0 &&
          analysis.estimatedRent > 0 &&
          analysis.monthlyExpenses >= 0 &&
          analysis.grossYield > 0;

        results.push({
          testName: `Calculation Components: ${testCase.name}`,
          passed: hasValidComponents,
          message: hasValidComponents 
            ? 'All calculation components are valid' 
            : 'Some calculation components are invalid',
          details: {
            purchasePrice: analysis.purchasePrice,
            estimatedRent: analysis.estimatedRent,
            monthlyExpenses: analysis.monthlyExpenses,
            grossYield: analysis.grossYield
          }
        });

      } catch (error) {
        results.push({
          testName: `Profitability Calculation: ${testCase.name}`,
          passed: false,
          message: `Error during calculation: ${error}`
        });
      }
    }

    return results;
  }

  async validateSearchTypes(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Test different Idealista URL patterns
    const urlPatterns = [
      {
        url: 'https://www.idealista.com/venta-viviendas/madrid/',
        expectedType: 'venta',
        description: 'Basic sale search'
      },
      {
        url: 'https://www.idealista.com/alquiler-viviendas/madrid/',
        expectedType: 'alquiler',
        description: 'Basic rental search'
      },
      {
        url: 'https://www.idealista.com/venta-viviendas/madrid/retiro/',
        expectedType: 'venta',
        description: 'Sale search with district'
      },
      {
        url: 'https://www.idealista.com/venta-viviendas/madrid/con-pisos,chalets/',
        expectedType: 'venta',
        description: 'Sale search with property types'
      },
      {
        url: 'https://www.idealista.com/inmueble/12345678/',
        expectedType: null,
        description: 'Individual property page (should not trigger)'
      }
    ];

    for (const pattern of urlPatterns) {
      try {
        // Mock the URL for testing
        const mockUrl = new URL(pattern.url);
        const analysis = this.urlAnalyzer.analyzeUrl(mockUrl);

        const passed = analysis.searchType === pattern.expectedType;
        
        results.push({
          testName: `URL Pattern: ${pattern.description}`,
          passed,
          message: passed 
            ? `Correctly identified as ${pattern.expectedType || 'not a search page'}` 
            : `Expected ${pattern.expectedType}, got ${analysis.searchType}`,
          details: {
            url: pattern.url,
            analysis
          }
        });

      } catch (error) {
        results.push({
          testName: `URL Pattern: ${pattern.description}`,
          passed: false,
          message: `Error during analysis: ${error}`
        });
      }
    }

    return results;
  }

  async runAllTests(): Promise<TestResult[]> {
    this.logger.log('Starting comprehensive testing suite');
    
    const allResults: TestResult[] = [];
    
    try {
      const urlTests = await this.validateUrlAnalysis();
      const calculationTests = await this.validateProfitabilityCalculations();
      const searchTests = await this.validateSearchTypes();
      
      allResults.push(...urlTests, ...calculationTests, ...searchTests);
      
      const passed = allResults.filter(r => r.passed).length;
      const total = allResults.length;
      
      this.logger.log(`Testing completed: ${passed}/${total} tests passed`);
      
      // Log failed tests for debugging
      const failed = allResults.filter(r => !r.passed);
      if (failed.length > 0) {
        this.logger.error('Failed tests:', failed);
      }
      
    } catch (error) {
      this.logger.error('Error during testing suite execution', error);
      allResults.push({
        testName: 'Testing Suite Execution',
        passed: false,
        message: `Error during test execution: ${error}`
      });
    }
    
    return allResults;
  }
}