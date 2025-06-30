export interface Investment {
  id: string;
  name: string;
  amount: number;
  currency: string;
  country: string;
  assetClass: string;
  dateAdded: string;
  transactionDate?: string;
  originalPrice?: number;
  maturityDate?: string;
  couponRate?: number;
  quantity?: number;
  pricePerUnit?: number;
}

export interface AllocationData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface SummaryStats {
  totalValue: number;
  totalInvestments: number;
  countries: string[];
  currencies: string[];
  assetClasses: string[];
  totalGrowth?: number;
  averageGrowth?: number;
} 