export interface UrlAnalysisResult {
  isIdealista: boolean;
  searchType: 'venta' | 'alquiler' | null;
  location: string | null;
  hasFilters: boolean;
}

export interface PropertyData {
  id: string;
  title: string;
  price: number;
  rooms: number | null;
  size: number | null;
  floor: string | null;
  hasGarage: boolean;
  description: string;
  url: string;
  tags: string[];
  location: string;
}

export interface RentalData {
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  sampleSize: number;
  properties: PropertyData[];
}

export interface ProfitabilityAnalysis {
  propertyId: string;
  purchasePrice: number;
  estimatedRent: number;
  grossYield: number;
  netYield: number;
  monthlyExpenses: number;
  monthlyMortgage: number;
  recommendation: 'excellent' | 'good' | 'fair' | 'poor';
  riskLevel: 'low' | 'medium' | 'high';
}
