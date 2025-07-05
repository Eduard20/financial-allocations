import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Calendar, DollarSign, TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { Investment, MaturityEarning, MaturitySummary } from '../types';

interface MaturityEarningsProps {
  investments: Investment[];
  convertToUSD: (amount: number, currency: string) => number;
  formatCurrency: (value: number) => string;
  formatTooltipValue: (value: number) => string;
}

export default function MaturityEarnings({ 
  investments, 
  convertToUSD, 
  formatCurrency, 
  formatTooltipValue 
}: MaturityEarningsProps) {
  
  // Calculate maturity earnings for bonds and deposits
  const maturityEarnings = useMemo(() => {
    const today = new Date();
    const earnings: MaturityEarning[] = [];
    
    investments
      .filter(inv => 
        (inv.assetClass === 'Bond' || inv.assetClass === 'Deposit') && 
        inv.maturityDate && 
        inv.couponRate
      )
      .forEach(inv => {
        // TypeScript guard - we know these exist due to filter
        if (!inv.maturityDate || !inv.couponRate) return;
        
        const maturityDate = new Date(inv.maturityDate);
        const daysToMaturity = Math.ceil((maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysToMaturity > 0) {
          const principalAmount = inv.amount;
          const couponRate = inv.couponRate / 100; // Convert percentage to decimal
          const yearsToMaturity = daysToMaturity / 365.25;
          
          // Calculate total interest earned
          const totalInterestEarned = principalAmount * couponRate * yearsToMaturity;
          const totalAmountAtMaturity = principalAmount + totalInterestEarned;
          
          // Convert to USD
          const usdPrincipalAmount = convertToUSD(principalAmount, inv.currency);
          const usdTotalInterestEarned = convertToUSD(totalInterestEarned, inv.currency);
          const usdTotalAmountAtMaturity = convertToUSD(totalAmountAtMaturity, inv.currency);
          
          // Calculate annualized return
          const annualizedReturn = yearsToMaturity > 0 ? (totalInterestEarned / principalAmount / yearsToMaturity) * 100 : 0;
          
          earnings.push({
            investmentId: inv.id,
            name: inv.name,
            currency: inv.currency,
            country: inv.country,
            assetClass: inv.assetClass,
            principalAmount,
            couponRate: inv.couponRate,
            maturityDate: inv.maturityDate,
            daysToMaturity,
            totalInterestEarned,
            totalAmountAtMaturity,
            usdPrincipalAmount,
            usdTotalInterestEarned,
            usdTotalAmountAtMaturity,
            annualizedReturn
          });
        }
      });
    
    return earnings.sort((a, b) => a.daysToMaturity - b.daysToMaturity);
  }, [investments, convertToUSD]);

  // Calculate summary statistics
  const maturitySummary = useMemo(() => {
    if (maturityEarnings.length === 0) {
      return {
        totalPrincipal: 0,
        totalInterestEarned: 0,
        totalAmountAtMaturity: 0,
        usdTotalPrincipal: 0,
        usdTotalInterestEarned: 0,
        usdTotalAmountAtMaturity: 0,
        averageAnnualizedReturn: 0,
        totalInvestments: 0,
        byCurrency: {},
        byMaturityYear: {}
      } as MaturitySummary;
    }

    const totalPrincipal = maturityEarnings.reduce((sum, earning) => sum + earning.principalAmount, 0);
    const totalInterestEarned = maturityEarnings.reduce((sum, earning) => sum + earning.totalInterestEarned, 0);
    const totalAmountAtMaturity = maturityEarnings.reduce((sum, earning) => sum + earning.totalAmountAtMaturity, 0);
    
    const usdTotalPrincipal = maturityEarnings.reduce((sum, earning) => sum + earning.usdPrincipalAmount, 0);
    const usdTotalInterestEarned = maturityEarnings.reduce((sum, earning) => sum + earning.usdTotalInterestEarned, 0);
    const usdTotalAmountAtMaturity = maturityEarnings.reduce((sum, earning) => sum + earning.usdTotalAmountAtMaturity, 0);
    
    const averageAnnualizedReturn = maturityEarnings.reduce((sum, earning) => sum + earning.annualizedReturn, 0) / maturityEarnings.length;

    // Group by currency
    const byCurrency = maturityEarnings.reduce((acc, earning) => {
      if (!acc[earning.currency]) {
        acc[earning.currency] = { principal: 0, interest: 0, total: 0, count: 0 };
      }
      acc[earning.currency].principal += earning.principalAmount;
      acc[earning.currency].interest += earning.totalInterestEarned;
      acc[earning.currency].total += earning.totalAmountAtMaturity;
      acc[earning.currency].count += 1;
      return acc;
    }, {} as Record<string, { principal: number; interest: number; total: number; count: number }>);

    // Group by maturity year - using USD amounts for consistent display
    const byMaturityYear = maturityEarnings.reduce((acc, earning) => {
      const year = new Date(earning.maturityDate).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = { principal: 0, interest: 0, total: 0, count: 0 };
      }
      acc[year].principal += earning.usdPrincipalAmount;
      acc[year].interest += earning.usdTotalInterestEarned;
      acc[year].total += earning.usdTotalAmountAtMaturity;
      acc[year].count += 1;
      return acc;
    }, {} as Record<string, { principal: number; interest: number; total: number; count: number }>);

    return {
      totalPrincipal,
      totalInterestEarned,
      totalAmountAtMaturity,
      usdTotalPrincipal,
      usdTotalInterestEarned,
      usdTotalAmountAtMaturity,
      averageAnnualizedReturn,
      totalInvestments: maturityEarnings.length,
      byCurrency,
      byMaturityYear
    };
  }, [maturityEarnings]);

  // Prepare chart data - all converted to USD for consistent display
  const currencyChartData = useMemo(() => {
    return Object.entries(maturitySummary.byCurrency).map(([currency, data]) => ({
      name: currency,
      principal: convertToUSD(data.principal, currency),
      interest: convertToUSD(data.interest, currency),
      total: convertToUSD(data.total, currency),
      count: data.count
    }));
  }, [maturitySummary.byCurrency, convertToUSD]);

  const yearChartData = useMemo(() => {
    return Object.entries(maturitySummary.byMaturityYear)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([year, data]) => ({
        name: year,
        principal: data.principal, // Already in USD
        interest: data.interest,   // Already in USD
        total: data.total,         // Already in USD
        count: data.count
      }));
  }, [maturitySummary.byMaturityYear]);

  const timelineData = useMemo(() => {
    return maturityEarnings.map(earning => ({
      name: earning.name,
      daysToMaturity: earning.daysToMaturity,
      totalAmountAtMaturity: earning.usdTotalAmountAtMaturity, // Use USD amount
      currency: earning.currency,
      maturityDate: earning.maturityDate
    }));
  }, [maturityEarnings]);

  if (maturityEarnings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Maturity Earnings</h3>
          <p className="text-gray-500">
            No bonds or deposits with maturity dates found. Add investments with maturity dates and coupon rates to see earnings projections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Principal</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(maturitySummary.usdTotalPrincipal)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Interest</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatCurrency(maturitySummary.usdTotalInterestEarned)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total at Maturity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(maturitySummary.usdTotalAmountAtMaturity)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <PieChartIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Return %</p>
              <p className="text-2xl font-semibold text-green-600">
                {maturitySummary.averageAnnualizedReturn.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maturity Timeline */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maturity Timeline (All amounts in USD)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="daysToMaturity" 
                  name="Days to Maturity"
                  tickFormatter={(value) => `${Math.round(value / 365.25)}y`}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [formatTooltipValue(value), 'Amount at Maturity']}
                  labelFormatter={(label) => `${Math.round(Number(label) / 365.25)} years to maturity`}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalAmountAtMaturity" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Currency Breakdown */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Currency (All amounts in USD)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currencyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Amount']} />
                <Bar dataKey="principal" stackId="a" fill="#10B981" name="Principal" />
                <Bar dataKey="interest" stackId="a" fill="#3B82F6" name="Interest" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Yearly Breakdown */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Maturity Year (All amounts in USD)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Amount']} />
              <Bar dataKey="principal" stackId="a" fill="#10B981" name="Principal" />
              <Bar dataKey="interest" stackId="a" fill="#3B82F6" name="Interest" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maturity Earnings Details</h3>
        <p className="text-sm text-gray-600 mb-4">* All chart amounts are converted to USD for consistent comparison. Original currency amounts shown in the table below.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total at Maturity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Equivalent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maturity Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Return</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maturityEarnings.map((earning, index) => (
                <tr key={earning.investmentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{earning.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {earning.principalAmount.toLocaleString('en-US', { 
                      style: 'currency', 
                      currency: earning.currency 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {earning.totalInterestEarned.toLocaleString('en-US', { 
                      style: 'currency', 
                      currency: earning.currency 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {earning.totalAmountAtMaturity.toLocaleString('en-US', { 
                      style: 'currency', 
                      currency: earning.currency 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(earning.usdTotalAmountAtMaturity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(earning.maturityDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {earning.daysToMaturity} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {earning.annualizedReturn.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 