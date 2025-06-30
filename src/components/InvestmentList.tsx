import React from 'react';
import { Edit, Trash2, TrendingUp, TrendingDown, Calendar, Percent, Hash } from 'lucide-react';
import { Investment } from '../types';

interface InvestmentListProps {
  investments: Investment[];
  onDelete: (id: string) => void;
  onEdit: (investment: Investment) => void;
}

const InvestmentList: React.FC<InvestmentListProps> = ({ investments, onDelete, onEdit }) => {
  const calculateGrowth = (currentAmount: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice === 0) return null;
    const growth = ((currentAmount - originalPrice) / originalPrice) * 100;
    return {
      percentage: growth,
      isPositive: growth >= 0
    };
  };

  const isBondOrDeposit = (investment: Investment) => {
    return investment.assetClass === 'Bond' || investment.assetClass === 'Deposit';
  };

  const formatCurrency = (amount: number, currency: string) => {
    // Handle very small numbers (like cryptocurrency prices) with more precision
    if (amount < 0.01) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (investments.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Investments Yet</h3>
          <p className="text-gray-500">Start by adding your first investment to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Investment Portfolio
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          A complete list of all your investments with growth tracking
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {investments.map((investment) => {
          const growth = calculateGrowth(investment.amount, investment.originalPrice);
          const showBondFields = isBondOrDeposit(investment);
          
          return (
            <li key={investment.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {investment.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {investment.currency} {investment.amount < 0.01 ? investment.amount.toFixed(8) : investment.amount.toLocaleString()}
                      </p>
                      {growth && (
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          growth.isPositive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {growth.isPositive ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {growth.percentage.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="truncate">{investment.assetClass}</span>
                      <span className="mx-1">•</span>
                      <span className="truncate">{investment.country}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-400 space-y-1">
                    <div>Added: {new Date(investment.dateAdded).toLocaleDateString()}</div>
                    {investment.transactionDate && (
                      <div>Transaction: {new Date(investment.transactionDate).toLocaleDateString()}</div>
                    )}
                    {investment.originalPrice && (
                      <div>Original: {investment.currency} {investment.originalPrice < 0.01 ? investment.originalPrice.toFixed(8) : investment.originalPrice.toLocaleString()}</div>
                    )}
                    {investment.quantity && investment.pricePerUnit && (
                      <div className="text-sm text-gray-500">
                        {investment.quantity > 1000000 ? investment.quantity.toLocaleString() : investment.quantity} {investment.assetClass === 'XAU' ? 'ounces' : 'units'} @ {formatCurrency(investment.pricePerUnit, investment.currency)}
                      </div>
                    )}
                    {showBondFields && investment.maturityDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Maturity: {new Date(investment.maturityDate).toLocaleDateString()}
                      </div>
                    )}
                    {showBondFields && investment.couponRate && (
                      <div className="flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        {investment.assetClass === 'Bond' ? 'Coupon' : 'Interest'}: {investment.couponRate}%
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => onEdit(investment)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(investment.id)}
                    className="text-red-600 hover:text-red-900 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InvestmentList; 