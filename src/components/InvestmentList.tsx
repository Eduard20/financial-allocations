import React from 'react';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Investment } from '../types';

interface InvestmentListProps {
  investments: Investment[];
  onDelete: (id: string) => void;
  onEdit: (investment: Investment) => void;
  currencyFilter: 'original' | 'USD';
  selectedCurrency: string;
  selectedCountry: string;
}

export default function InvestmentList({ 
  investments, 
  onDelete, 
  onEdit, 
  currencyFilter, 
  selectedCurrency, 
  selectedCountry
}: InvestmentListProps) {
  // Get current market value for an investment using stored amounts
  const getCurrentMarketValue = (investment: Investment): number => {
    if (!investment.quantity || !investment.pricePerUnit) {
      return investment.amount;
    }
    return investment.quantity * investment.pricePerUnit;
  };

  // Calculate growth for an investment
  const calculateGrowth = (investment: Investment): { amount: number; percentage: number } | null => {
    if (!investment.originalPrice || investment.originalPrice <= 0) {
      return null;
    }

    const currentValue = getCurrentMarketValue(investment);
    const growthAmount = currentValue - investment.originalPrice;
    const growthPercentage = (growthAmount / investment.originalPrice) * 100;

    return {
      amount: growthAmount,
      percentage: growthPercentage
    };
  };

  const formatCurrency = (amount: number, currency: string): string => {
    if (currencyFilter === 'USD') {
      return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
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
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const filteredInvestments = investments.filter(investment => {
    if (selectedCurrency !== 'all' && investment.currency !== selectedCurrency) {
      return false;
    }
    if (selectedCountry !== 'all' && investment.country !== selectedCountry) {
      return false;
    }
    return true;
  });

  if (filteredInvestments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No investments found matching the current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Your Investments</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvestments.map((investment) => {
              const currentValue = getCurrentMarketValue(investment);
              const growth = calculateGrowth(investment);
              
              return (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                      <div className="text-sm text-gray-500">
                        {investment.quantity} {investment.assetClass === 'XAU' ? 'ounces' : 'units'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(currentValue, investment.currency)}
                    </div>
                    {investment.originalPrice && (
                      <div className="text-xs text-gray-500">
                        Original: {formatCurrency(investment.originalPrice, investment.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {growth ? (
                      <div className="flex items-center space-x-1">
                        {getGrowthIcon(growth.percentage)}
                        <span className={`text-sm font-medium ${getGrowthColor(growth.percentage)}`}>
                          {formatGrowth(growth.percentage)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                    {growth && (
                      <div className="text-xs text-gray-500">
                        {formatCurrency(growth.amount, investment.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {investment.assetClass}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {investment.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(investment.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(investment)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit investment"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(investment.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete investment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 