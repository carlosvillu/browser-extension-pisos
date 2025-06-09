import type { Logger } from '../../infrastructure/logger';
import type { ProfitabilityAnalysis, PropertyData, RentalData } from '../interfaces';
import { ConfigService, type UserConfig } from './config-service';

export interface IProfitabilityCalculator {
  calculateProfitability(property: PropertyData, rentalData: RentalData): Promise<ProfitabilityAnalysis>;
}

export interface ExpenseCalculationConfig {
  propertyManagementRate: number;
  insuranceRate: number;
  propertyTaxRate: number;
  communityFeesWithGarage: number;
  communityFeesWithoutGarage: number;
  vacancyMaintenanceRate: number;
}

export class ProfitabilityCalculator implements IProfitabilityCalculator {
  private readonly DEFAULT_CONFIG: ExpenseCalculationConfig = {
    propertyManagementRate: 0.09,
    insuranceRate: 0.002,
    propertyTaxRate: 0.007,
    communityFeesWithGarage: 80,
    communityFeesWithoutGarage: 40,
    vacancyMaintenanceRate: 0.05,
  };

  private configService: ConfigService;
  private userConfig?: UserConfig;

  constructor(
    private logger: Logger,
    private config: ExpenseCalculationConfig = {} as ExpenseCalculationConfig,
  ) {
    this.config = { ...this.DEFAULT_CONFIG, ...config };
    this.configService = new ConfigService();
  }

  async calculateProfitability(property: PropertyData, rentalData: RentalData): Promise<ProfitabilityAnalysis> {
    if (!this.userConfig) {
      this.userConfig = await this.configService.getConfig();
    }

    const activeConfig = this.userConfig.expenseConfig;

    const monthlyRent = rentalData.averagePrice;
    const annualRent = monthlyRent * 12;
    const purchasePrice = property.price;

    const grossYield = (annualRent / purchasePrice) * 100;

    const monthlyExpenses = this.calculateMonthlyExpenses(property, monthlyRent, activeConfig);
    const monthlyMortgage = this.calculateMonthlyMortgage(purchasePrice, activeConfig);
    const totalMonthlyExpenses = monthlyExpenses + monthlyMortgage;
    const annualExpenses = totalMonthlyExpenses * 12;
    const netAnnualRent = annualRent - annualExpenses;

    const netYield = Math.max(0, (netAnnualRent / purchasePrice) * 100);

    const { recommendation, riskLevel } = this.evaluateInvestment(grossYield, netYield, rentalData.sampleSize);

    this.logger.log(
      `Profitability calculation for ${property.id}: Gross ${grossYield.toFixed(2)}%, Net ${netYield.toFixed(2)}% (including mortgage ${monthlyMortgage}€/month)`,
    );

    return {
      propertyId: property.id,
      purchasePrice,
      estimatedRent: monthlyRent,
      grossYield: Math.round(grossYield * 100) / 100,
      netYield: Math.round(netYield * 100) / 100,
      monthlyExpenses,
      monthlyMortgage,
      recommendation,
      riskLevel,
    };
  }

  private calculateMonthlyExpenses(property: PropertyData, monthlyRent: number, expenseConfig: any): number {
    let expenses = 0;

    expenses += expenseConfig.propertyManagementMonthly || 150;
    expenses += expenseConfig.insuranceMonthly || 50;
    expenses += expenseConfig.propertyTaxMonthly || 100;

    expenses += expenseConfig.communityFees || 60;

    expenses += monthlyRent * (expenseConfig.vacancyMaintenanceRate || 0.05);
    expenses += monthlyRent * (expenseConfig.maintenanceContingencyRate || 0.01);

    return Math.round(expenses);
  }

  private calculateMonthlyMortgage(purchasePrice: number, expenseConfig: any): number {
    const downPaymentPercentage = expenseConfig.downPaymentPercentage || 0.2;
    const interestRate = expenseConfig.mortgageInterestRate || 0.035;
    const loanTermYears = expenseConfig.loanTermYears || 30;

    const loanAmount = purchasePrice * (1 - downPaymentPercentage);
    const monthlyInterestRate = interestRate / 12;
    const numberOfPayments = loanTermYears * 12;

    if (loanAmount <= 0 || monthlyInterestRate === 0) {
      return 0;
    }

    const monthlyPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    return Math.round(monthlyPayment);
  }

  private evaluateInvestment(
    grossYield: number,
    netYield: number,
    sampleSize: number,
  ): {
    recommendation: 'excellent' | 'good' | 'fair' | 'poor';
    riskLevel: 'low' | 'medium' | 'high';
  } {
    let recommendation: 'excellent' | 'good' | 'fair' | 'poor';
    let riskLevel: 'low' | 'medium' | 'high';

    const thresholds = this.userConfig?.profitabilityThresholds || {
      excellent: 6,
      good: 4,
      fair: 2,
    };

    if (netYield >= thresholds.excellent) {
      recommendation = 'excellent';
    } else if (netYield >= thresholds.good) {
      recommendation = 'good';
    } else if (netYield >= thresholds.fair) {
      recommendation = 'fair';
    } else {
      recommendation = 'poor';
    }

    if (sampleSize < 3) {
      riskLevel = 'high';
    } else if (grossYield > 8 || netYield < 1) {
      riskLevel = 'high';
    } else if (netYield >= 3 && grossYield <= 7) {
      riskLevel = 'low';
    } else {
      riskLevel = 'medium';
    }

    return { recommendation, riskLevel };
  }
}
