import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Filter, Globe, DollarSign, TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { Investment, AllocationData } from '../types';

interface PortfolioViewProps {
  investments: Investment[];
  convertToUSD: (amount: number, currency: string) => number;
  formatCurrency: (value: number) => string;
  formatTooltipValue: (value: number) => string;
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export default function PortfolioView({ 
  investments, 
  convertToUSD, 
  formatCurrency, 
  formatTooltipValue 
}: PortfolioViewProps) {
  const [viewMode, setViewMode] = useState<'consolidated' | 'byCurrency' | 'byCountry' | 'byAsset'>('consolidated');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('all');
  const [displayCurrency, setDisplayCurrency] = useState<'original' | 'USD'>('USD');

  // Get unique values for filters
  const availableCurrencies = useMemo(() => 
    [...new Set(investments.map(inv => inv.currency))].sort(), [investments]
  );
  
  const availableCountries = useMemo(() => 
    [...new Set(investments.map(inv => inv.country))].sort(), [investments]
  );
  
  const availableAssetClasses = useMemo(() => 
    [...new Set(investments.map(inv => inv.assetClass))].sort(), [investments]
  );

  // Filter investments based on selected criteria
  const filteredInvestments = useMemo(() => {
    let filtered = investments;
    
    if (selectedCurrency !== 'all') {
      filtered = filtered.filter(inv => inv.currency === selectedCurrency);
    }
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(inv => inv.country === selectedCountry);
    }
    if (selectedAssetClass !== 'all') {
      filtered = filtered.filter(inv => inv.assetClass === selectedAssetClass);
    }
    
    return filtered;
  }, [investments, selectedCurrency, selectedCountry, selectedAssetClass]);

  // Calculate portfolio statistics
  const portfolioStats = useMemo(() => {
    const totalValue = displayCurrency === 'USD' 
      ? filteredInvestments.reduce((sum, inv) => sum + convertToUSD(inv.amount, inv.currency), 0)
      : filteredInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);

    const totalInvestments = filteredInvestments.length;
    
    // Calculate growth statistics
    const investmentsWithGrowth = filteredInvestments.filter(inv => inv.originalPrice && inv.originalPrice > 0);
    let totalGrowth = 0;
    let averageGrowth = 0;

    if (investmentsWithGrowth.length > 0) {
      const totalOriginalValue = investmentsWithGrowth.reduce((sum, inv) => {
        const originalValue = displayCurrency === 'USD' 
          ? convertToUSD(Number(inv.originalPrice || 0), inv.currency)
          : Number(inv.originalPrice || 0);
        return sum + originalValue;
      }, 0);
      
      const totalCurrentValue = investmentsWithGrowth.reduce((sum, inv) => {
        const currentValue = displayCurrency === 'USD' 
          ? convertToUSD(inv.amount, inv.currency)
          : Number(inv.amount);
        return sum + currentValue;
      }, 0);
      
      totalGrowth = totalCurrentValue - totalOriginalValue;
      averageGrowth = totalOriginalValue > 0 ? (totalGrowth / totalOriginalValue) * 100 : 0;
    }

    return { totalValue, totalInvestments, totalGrowth, averageGrowth };
  }, [filteredInvestments, displayCurrency, convertToUSD]);

  // Generate allocation data based on view mode
  const allocationData = useMemo(() => {
    if (viewMode === 'consolidated') {
      // Consolidated view - convert all to USD
      const allocation = filteredInvestments.reduce((acc, inv) => {
        const value = convertToUSD(inv.amount, inv.currency);
        acc[inv.assetClass] = (acc[inv.assetClass] || 0) + value;
        return acc;
      }, {} as Record<string, number>);

      const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
      
      return Object.entries(allocation).map(([name, value], index) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[index % COLORS.length]
      }));
    } else if (viewMode === 'byCurrency') {
      // Group by currency
      const allocation = filteredInvestments.reduce((acc, inv) => {
        const value = displayCurrency === 'USD' 
          ? convertToUSD(inv.amount, inv.currency)
          : Number(inv.amount);
        acc[inv.currency] = (acc[inv.currency] || 0) + value;
        return acc;
      }, {} as Record<string, number>);

      const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
      
      return Object.entries(allocation).map(([name, value], index) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[index % COLORS.length]
      }));
    } else if (viewMode === 'byCountry') {
      // Group by country
      const allocation = filteredInvestments.reduce((acc, inv) => {
        const value = displayCurrency === 'USD' 
          ? convertToUSD(inv.amount, inv.currency)
          : Number(inv.amount);
        acc[inv.country] = (acc[inv.country] || 0) + value;
        return acc;
      }, {} as Record<string, number>);

      const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
      
      return Object.entries(allocation).map(([name, value], index) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[index % COLORS.length]
      }));
    } else {
      // By asset class
      const allocation = filteredInvestments.reduce((acc, inv) => {
        const value = displayCurrency === 'USD' 
          ? convertToUSD(inv.amount, inv.currency)
          : Number(inv.amount);
        acc[inv.assetClass] = (acc[inv.assetClass] || 0) + value;
        return acc;
      }, {} as Record<string, number>);

      const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
      
      return Object.entries(allocation).map(([name, value], index) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[index % COLORS.length]
      }));
    }
  }, [filteredInvestments, viewMode, displayCurrency, convertToUSD]);

  // Generate detailed breakdown table
  const breakdownData = useMemo(() => {
    const grouped = filteredInvestments.reduce((acc, inv) => {
      const key = `${inv.country}-${inv.currency}-${inv.assetClass}`;
      if (!acc[key]) {
        acc[key] = {
          country: inv.country,
          currency: inv.currency,
          assetClass: inv.assetClass,
          originalAmount: 0,
          usdAmount: 0,
          count: 0
        };
      }
      acc[key].originalAmount += Number(inv.amount);
      acc[key].usdAmount += convertToUSD(inv.amount, inv.currency);
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).sort((a, b) => b.usdAmount - a.usdAmount);
  }, [filteredInvestments, convertToUSD]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Portfolio Filters</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Advanced Filtering</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Currencies</option>
              {availableCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Countries</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Class</label>
            <select
              value={selectedAssetClass}
              onChange={(e) => setSelectedAssetClass(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Asset Classes</option>
              {availableAssetClasses.map(assetClass => (
                <option key={assetClass} value={assetClass}>{assetClass}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Currency</label>
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value as 'original' | 'USD')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="USD">USD</option>
              <option value="original">Original</option>
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(portfolioStats.totalValue)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Investments</p>
              <p className="text-2xl font-semibold text-gray-900">{portfolioStats.totalInvestments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Growth</p>
              <p className={`text-2xl font-semibold ${portfolioStats.totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioStats.totalGrowth)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <PieChartIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Growth %</p>
              <p className={`text-2xl font-semibold ${portfolioStats.averageGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioStats.averageGrowth.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio View</h3>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('consolidated')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'consolidated'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            Consolidated
          </button>
          <button
            onClick={() => setViewMode('byCurrency')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'byCurrency'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="h-4 w-4 inline mr-2" />
            By Currency
          </button>
          <button
            onClick={() => setViewMode('byCountry')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'byCountry'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            By Country
          </button>
          <button
            onClick={() => setViewMode('byAsset')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'byAsset'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            By Asset Class
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {viewMode === 'consolidated' && 'Consolidated Portfolio Allocation'}
            {viewMode === 'byCurrency' && 'Allocation by Currency'}
            {viewMode === 'byCountry' && 'Allocation by Country'}
            {viewMode === 'byAsset' && 'Allocation by Asset Class'}
            {displayCurrency === 'USD' ? ' (USD)' : ' (Original Currencies)'}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Value']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {viewMode === 'consolidated' && 'Asset Class Breakdown'}
            {viewMode === 'byCurrency' && 'Currency Breakdown'}
            {viewMode === 'byCountry' && 'Country Breakdown'}
            {viewMode === 'byAsset' && 'Asset Class Breakdown'}
            {displayCurrency === 'USD' ? ' (USD)' : ' (Original Currencies)'}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Value']} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {breakdownData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.assetClass}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.originalAmount.toLocaleString('en-US', { 
                      style: 'currency', 
                      currency: row.currency 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.usdAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 