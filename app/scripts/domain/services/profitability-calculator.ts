import { PropertyData, RentalData, ProfitabilityAnalysis } from '../interfaces';
import { Logger } from '../../infrastructure/logger';

export interface IProfitabilityCalculator {
  calculateProfitability(property: PropertyData, rentalData: RentalData): ProfitabilityAnalysis;
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
    vacancyMaintenanceRate: 0.05
  };

  constructor(
    private logger: Logger,
    private config: ExpenseCalculationConfig = {} as ExpenseCalculationConfig
  ) {
    this.config = { ...this.DEFAULT_CONFIG, ...config };
  }

  calculateProfitability(property: PropertyData, rentalData: RentalData): ProfitabilityAnalysis {
    const monthlyRent = rentalData.averagePrice;
    const annualRent = monthlyRent * 12;
    const purchasePrice = property.price;

    const grossYield = (annualRent / purchasePrice) * 100;

    const monthlyExpenses = this.calculateMonthlyExpenses(property, monthlyRent);
    const annualExpenses = monthlyExpenses * 12;
    const netAnnualRent = annualRent - annualExpenses;

    const netYield = Math.max(0, (netAnnualRent / purchasePrice) * 100);

    const { recommendation, riskLevel } = this.evaluateInvestment(grossYield, netYield, rentalData.sampleSize);

    this.logger.log(`Profitability calculation for ${property.id}: Gross ${grossYield.toFixed(2)}%, Net ${netYield.toFixed(2)}%`);

    return {
      propertyId: property.id,
      purchasePrice,
      estimatedRent: monthlyRent,
      grossYield: Math.round(grossYield * 100) / 100,
      netYield: Math.round(netYield * 100) / 100,
      monthlyExpenses,
      recommendation,
      riskLevel
    };
  }

  private calculateMonthlyExpenses(property: PropertyData, monthlyRent: number): number {
    let expenses = 0;

    expenses += monthlyRent * this.config.propertyManagementRate;

    const propertyValue = property.price;
    const annualInsurance = propertyValue * this.config.insuranceRate;
    expenses += annualInsurance / 12;

    const annualIBI = propertyValue * this.config.propertyTaxRate;
    expenses += annualIBI / 12;

    if (property.hasGarage || property.floor?.includes('ascensor')) {
      expenses += this.config.communityFeesWithGarage;
    } else {
      expenses += this.config.communityFeesWithoutGarage;
    }

    expenses += monthlyRent * this.config.vacancyMaintenanceRate;

    return Math.round(expenses);
  }

  private evaluateInvestment(grossYield: number, netYield: number, sampleSize: number): {
    recommendation: 'excellent' | 'good' | 'fair' | 'poor';
    riskLevel: 'low' | 'medium' | 'high';
  } {
    let recommendation: 'excellent' | 'good' | 'fair' | 'poor';
    let riskLevel: 'low' | 'medium' | 'high';

    if (netYield >= 6) {
      recommendation = 'excellent';
    } else if (netYield >= 4) {
      recommendation = 'good';
    } else if (netYield >= 2) {
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