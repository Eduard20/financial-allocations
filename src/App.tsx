import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, BarChart3, DollarSign, Building2, Filter, Globe, PieChart as PieChartIcon } from 'lucide-react';
import { Investment, AllocationData, SummaryStats } from './types';
import InvestmentForm from './components/InvestmentForm';
import InvestmentList from './components/InvestmentList';
import SummaryCards from './components/SummaryCards';
import PortfolioView from './components/PortfolioView';

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

const API_BASE_URL = 'http://localhost:3001/api';

// Mock exchange rates (in a real app, you'd fetch these from an API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  AMD: 0.0026,
  AED: 0.27,
  JPY: 0.007,
  CAD: 0.75,
  AUD: 0.68,
  CHF: 0.92,
  SEK: 0.095,
  NOK: 0.095,
  DKK: 0.13,
  SGD: 0.74,
  HKD: 0.13,
  CNY: 0.14,
  INR: 0.012,
  BRL: 0.19,
  MXN: 0.058,
  ZAR: 0.055
};

function App() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'investments' | 'portfolio'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currencyFilter, setCurrencyFilter] = useState<'original' | 'USD'>('original');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  // Load investments from server
  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/investments`);
      if (!response.ok) {
        throw new Error('Failed to load investments');
      }
      const data = await response.json();
      setInvestments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load investments. Make sure the server is running.');
      console.error('Error loading investments:', err);
    } finally {
      setLoading(false);
    }
  };

  const addInvestment = async (investment: Omit<Investment, 'id' | 'dateAdded'>) => {
    try {
      const newInvestment: Investment = {
        ...investment,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvestment),
      });

      if (!response.ok) {
        throw new Error('Failed to add investment');
      }

      const savedInvestment = await response.json();
      setInvestments([...investments, savedInvestment]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add investment');
      console.error('Error adding investment:', err);
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete investment');
      }

      setInvestments(investments.filter(inv => inv.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete investment');
      console.error('Error deleting investment:', err);
    }
  };

  const convertToUSD = (amount: number, currency: string): number => {
    const rate = EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES] || 1;
    return amount * rate;
  };

  const getSummaryStats = (): SummaryStats => {
    let filteredInvestments = investments;
    
    // Filter by selected currency and country
    if (currencyFilter === 'original') {
      if (selectedCurrency !== 'all') {
        filteredInvestments = filteredInvestments.filter(inv => inv.currency === selectedCurrency);
      }
      if (selectedCountry !== 'all') {
        filteredInvestments = filteredInvestments.filter(inv => inv.country === selectedCountry);
      }
    }
    
    let totalValue: number;
    
    if (currencyFilter === 'USD') {
      // Convert all amounts to USD
      totalValue = filteredInvestments.reduce((sum, inv) => {
        return sum + convertToUSD(inv.amount, inv.currency);
      }, 0);
    } else {
      // Keep original currencies, just sum the amounts
      totalValue = filteredInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    }

    const countries = [...new Set(filteredInvestments.map(inv => inv.country))];
    const currencies = [...new Set(filteredInvestments.map(inv => inv.currency))];
    const assetClasses = [...new Set(filteredInvestments.map(inv => inv.assetClass))];

    // Calculate growth statistics
    const investmentsWithGrowth = filteredInvestments.filter(inv => inv.originalPrice && inv.originalPrice > 0);
    let totalGrowth = 0;
    let averageGrowth = 0;

    if (investmentsWithGrowth.length > 0) {
      const totalOriginalValue = investmentsWithGrowth.reduce((sum, inv) => sum + Number(inv.originalPrice || 0), 0);
      const totalCurrentValue = investmentsWithGrowth.reduce((sum, inv) => sum + Number(inv.amount), 0);
      totalGrowth = totalCurrentValue - totalOriginalValue;
      averageGrowth = totalGrowth / totalOriginalValue * 100;
    }

    return {
      totalValue,
      totalInvestments: filteredInvestments.length,
      countries,
      currencies,
      assetClasses,
      totalGrowth,
      averageGrowth
    };
  };

  const getAssetClassAllocation = (): AllocationData[] => {
    let filteredInvestments = investments;
    
    // Filter by selected currency and country
    if (currencyFilter === 'original') {
      if (selectedCurrency !== 'all') {
        filteredInvestments = filteredInvestments.filter(inv => inv.currency === selectedCurrency);
      }
      if (selectedCountry !== 'all') {
        filteredInvestments = filteredInvestments.filter(inv => inv.country === selectedCountry);
      }
    }

    if (currencyFilter === 'USD') {
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
    } else {
      // Original currencies - group by asset class and currency when showing mixed currencies
      const allocation = filteredInvestments.reduce((acc, inv) => {
        let key = inv.assetClass;
        
        // If we're showing mixed currencies (country selected but currency is "all"), 
        // group by asset class + currency
        if (selectedCurrency === 'all' && selectedCountry !== 'all') {
          key = `${inv.assetClass} (${inv.currency})`;
        }
        
        acc[key] = (acc[key] || 0) + Number(inv.amount);
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
  };

  const getCountryAllocation = (): AllocationData[] => {
    let filteredInvestments = investments;
    
    // Filter by selected currency and country
    if (currencyFilter === 'original') {
      if (selectedCurrency !== 'all') {
        filteredInvestments = filteredInvestments.filter(inv => inv.currency === selectedCurrency);
      }
      if (selectedCountry !== 'all') {
        filteredInvestments = filteredInvestments.filter(inv => inv.country === selectedCountry);
      }
    }

    if (currencyFilter === 'USD') {
      // Consolidated view - convert all to USD
      const allocation = filteredInvestments.reduce((acc, inv) => {
        const value = convertToUSD(inv.amount, inv.currency);
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
      // Original currencies - group by country and currency when showing mixed currencies
      const allocation = filteredInvestments.reduce((acc, inv) => {
        let key = inv.country;
        
        // If we're showing mixed currencies (country selected but currency is "all"), 
        // group by country + currency
        if (selectedCurrency === 'all' && selectedCountry !== 'all') {
          key = `${inv.country} (${inv.currency})`;
        }
        
        acc[key] = (acc[key] || 0) + Number(inv.amount);
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
  };

  const formatCurrency = (value: number): string => {
    if (currencyFilter === 'USD') {
      return `$${value.toLocaleString()}`;
    } else {
      // Show the selected currency or mixed indicator
      if (selectedCurrency !== 'all') {
        return `${selectedCurrency} ${value.toLocaleString()}`;
      } else if (selectedCountry !== 'all') {
        // When country is selected but currency is "all", show mixed currencies
        return `${value.toLocaleString()} (Mixed)`;
      } else {
        return `${value.toLocaleString()} (Mixed)`;
      }
    }
  };

  const formatTooltipValue = (value: number): string => {
    if (currencyFilter === 'USD') {
      return `$${value.toLocaleString()}`;
    } else {
      if (selectedCurrency !== 'all') {
        return `${selectedCurrency} ${value.toLocaleString()}`;
      } else if (selectedCountry !== 'all') {
        // When country is selected but currency is "all", show mixed currencies
        return `${value.toLocaleString()} (Mixed)`;
      } else {
        return `${value.toLocaleString()} (Mixed)`;
      }
    }
  };

  // Get available currencies and countries for filters
  const availableCurrencies = [...new Set(investments.map(inv => inv.currency))].sort();
  const availableCountries = [...new Set(investments.map(inv => inv.country))].sort();

  const stats = getSummaryStats();
  const assetClassData = getAssetClassAllocation();
  const countryData = getCountryAllocation();

  const handleEditInvestment = async (investmentData: Omit<Investment, 'id' | 'dateAdded'>) => {
    if (!editingInvestment) return;

    try {
      const response = await fetch(`${API_BASE_URL}/investments/${editingInvestment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
      });

      if (response.ok) {
        const updatedInvestment = await response.json();
        setInvestments(prev => 
          prev.map(inv => inv.id === editingInvestment.id ? updatedInvestment : inv)
        );
        setEditingInvestment(null);
        setShowForm(false);
      } else {
        console.error('Failed to update investment');
      }
    } catch (error) {
      console.error('Error updating investment:', error);
    }
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingInvestment(null);
  };

  const handleFormSubmit = (investmentData: Omit<Investment, 'id' | 'dateAdded'>) => {
    if (editingInvestment) {
      handleEditInvestment(investmentData);
    } else {
      addInvestment(investmentData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Financial Allocations
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Investment
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mx-4 mt-4">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'investments'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className="h-4 w-4 inline mr-2" />
                Investments
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'portfolio'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <PieChartIcon className="h-4 w-4 inline mr-2" />
                Portfolio
              </button>
            </div>
            
            {/* Currency Filter */}
            {activeTab === 'dashboard' && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={currencyFilter}
                    onChange={(e) => {
                      setCurrencyFilter(e.target.value as 'original' | 'USD');
                      setSelectedCurrency('all');
                      setSelectedCountry('all');
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="original">Original Currencies</option>
                    <option value="USD">Convert to USD</option>
                  </select>
                </div>
                
                {currencyFilter === 'original' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Currency:</span>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Currencies</option>
                        {availableCurrencies.map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Country:</span>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Countries</option>
                        {availableCountries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            <SummaryCards stats={stats} currencyFilter={currencyFilter} formatCurrency={formatCurrency} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Class Allocation */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currencyFilter === 'USD' 
                      ? 'Asset Class Allocation (USD)' 
                      : selectedCurrency !== 'all' 
                        ? `Asset Class Allocation (${selectedCurrency})${selectedCountry !== 'all' ? ` - ${selectedCountry}` : ''}`
                        : selectedCountry !== 'all'
                          ? `Asset Class Allocation - ${selectedCountry} (Mixed Currencies)`
                          : 'Asset Class Allocation (Mixed Currencies)'
                    }
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetClassData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percentage }) => `${percentage.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {assetClassData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Value']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Country Allocation */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currencyFilter === 'USD' 
                      ? 'Geographic Allocation (USD)' 
                      : selectedCurrency !== 'all' 
                        ? `Geographic Allocation (${selectedCurrency})${selectedCountry !== 'all' ? ` - ${selectedCountry}` : ''}`
                        : selectedCountry !== 'all'
                          ? `Geographic Allocation - ${selectedCountry} (Mixed Currencies)`
                          : 'Geographic Allocation (Mixed Currencies)'
                    }
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={countryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percentage }) => `${percentage.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {countryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Value']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'investments' ? (
          <InvestmentList
            investments={investments}
            onDelete={deleteInvestment}
            onEdit={handleEdit}
          />
        ) : (
          <PortfolioView 
            investments={investments}
            convertToUSD={convertToUSD}
            formatCurrency={formatCurrency}
            formatTooltipValue={formatTooltipValue}
          />
        )}
      </main>

      {/* Investment Form Modal */}
      {showForm && (
        <InvestmentForm
          investment={editingInvestment || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}

export default App; 