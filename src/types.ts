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

// New types for maturity earnings
export interface MaturityEarning {
  investmentId: string;
  name: string;
  currency: string;
  country: string;
  assetClass: string;
  principalAmount: number;
  couponRate: number;
  maturityDate: string;
  daysToMaturity: number;
  totalInterestEarned: number;
  totalAmountAtMaturity: number;
  usdPrincipalAmount: number;
  usdTotalInterestEarned: number;
  usdTotalAmountAtMaturity: number;
  annualizedReturn: number;
}

export interface MaturitySummary {
  totalPrincipal: number;
  totalInterestEarned: number;
  totalAmountAtMaturity: number;
  usdTotalPrincipal: number;
  usdTotalInterestEarned: number;
  usdTotalAmountAtMaturity: number;
  averageAnnualizedReturn: number;
  totalInvestments: number;
  byCurrency: Record<string, {
    principal: number;
    interest: number;
    total: number;
    count: number;
  }>;
  byMaturityYear: Record<string, {
    principal: number;
    interest: number;
    total: number;
    count: number;
  }>;
} 