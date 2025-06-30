import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Building2, Globe, PieChart } from 'lucide-react';
import { SummaryStats } from '../types';

interface SummaryCardsProps {
  stats: SummaryStats;
  currencyFilter: 'original' | 'USD';
}

export default function SummaryCards({ stats, currencyFilter }: SummaryCardsProps) {
  const formatCurrency = (amount: number): string => {
    if (currencyFilter === 'USD') {
      return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatGrowth = (growth: number): string => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(2)}%`;
  };

  const getGrowthColor = (growth: number): string => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp className="h-5 w-5 text-green-600" /> : 
      <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              Total Value ({currencyFilter === 'USD' ? 'USD' : 'Original'})
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Growth */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {stats.averageGrowth !== undefined ? getGrowthIcon(stats.averageGrowth) : <DollarSign className="h-5 w-5 text-gray-400" />}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Growth</p>
            {stats.averageGrowth !== undefined ? (
              <>
                <p className={`text-2xl font-bold ${getGrowthColor(stats.averageGrowth)}`}>
                  {formatGrowth(stats.averageGrowth)}
                </p>
                {stats.totalGrowth !== undefined && (
                  <p className="text-sm text-gray-500">
                    {formatCurrency(stats.totalGrowth)} {currencyFilter === 'USD' ? 'USD' : ''}
                  </p>
                )}
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-400">N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* Number of Investments */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <PieChart className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Investments</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalInvestments}
            </p>
            <p className="text-sm text-gray-500">
              {stats.assetClasses.length} asset classes
            </p>
          </div>
        </div>
      </div>

      {/* Geographic Diversity */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Globe className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Countries</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.countries.length}
            </p>
            <p className="text-sm text-gray-500">
              {stats.currencies.length} currencies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 