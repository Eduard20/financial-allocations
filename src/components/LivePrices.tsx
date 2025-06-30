import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, Coins, BarChart3 } from 'lucide-react';
import { priceService, PriceData } from '../services/priceService';
import { Investment } from '../types';

interface LivePricesProps {
  investments?: Investment[];
  livePrices?: PriceData[];
  priceLoading?: boolean;
  onPriceSelect?: (symbol: string, price: number, assetType: string) => void;
}

export default function LivePrices({ 
  investments = [], 
  livePrices = [], 
  priceLoading = false,
  onPriceSelect 
}: LivePricesProps) {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'etfs' | 'crypto' | 'gold'>('etfs');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      let newPrices: PriceData[] = [];
      
      switch (activeTab) {
        case 'etfs':
          newPrices = await priceService.getPopularETFPrices();
          break;
        case 'crypto':
          newPrices = await priceService.getPopularCryptoPrices();
          break;
        case 'gold':
          const goldPrice = await priceService.getPrice('XAU', 'XAU');
          if (goldPrice) newPrices = [goldPrice];
          break;
      }
      
      setPrices(newPrices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [activeTab]);

  // Get current market value for an investment
  const getCurrentMarketValue = (investment: Investment): number => {
    if (!investment.quantity || !investment.pricePerUnit) {
      return investment.amount;
    }

    const livePrice = livePrices.find(price => 
      price.symbol === investment.name || 
      (investment.assetClass === 'XAU' && price.symbol === 'XAU')
    );

    if (livePrice) {
      return investment.quantity * livePrice.price;
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

  const handlePriceClick = (price: PriceData) => {
    if (onPriceSelect) {
      const assetType = activeTab === 'etfs' ? 'ETF' : activeTab === 'crypto' ? 'Cryptocurrency' : 'XAU';
      onPriceSelect(price.symbol, price.price, assetType);
    }
  };

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined || price === null || isNaN(price)) {
      return 'N/A';
    }
    if (price < 0.01) {
      return `$${price.toFixed(8)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatChange = (change: number | undefined): string => {
    if (change === undefined) return '';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number | undefined): string => {
    if (change === undefined) return 'text-gray-500';
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number | undefined) => {
    if (change === undefined) return null;
    return change >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  // Filter investments by current tab
  const getRelevantInvestments = () => {
    switch (activeTab) {
      case 'etfs':
        return investments.filter(inv => inv.assetClass === 'ETF' || inv.assetClass === 'Stock');
      case 'crypto':
        return investments.filter(inv => inv.assetClass === 'Cryptocurrency');
      case 'gold':
        return investments.filter(inv => inv.assetClass === 'XAU');
      default:
        return [];
    }
  };

  const relevantInvestments = getRelevantInvestments();

  return (
    <div className="space-y-6">
      {/* Live Market Prices */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Market Prices</h3>
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh prices"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('etfs')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'etfs'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>ETFs</span>
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'crypto'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>Crypto</span>
          </button>
          <button
            onClick={() => setActiveTab('gold')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'gold'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Gold</span>
          </button>
        </div>

        {/* Market Prices Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading market prices...</span>
          </div>
        ) : prices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((price) => (
              <div
                key={price.symbol}
                onClick={() => handlePriceClick(price)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  onPriceSelect 
                    ? 'hover:bg-gray-50 hover:border-blue-300' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{price.symbol}</h4>
                  {getChangeIcon(price.changePercent24h)}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(price.price)}
                </div>
                {price.changePercent24h !== undefined && (
                  <div className={`text-sm font-medium ${getChangeColor(price.changePercent24h)}`}>
                    {formatChange(price.changePercent24h)}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(price.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No market prices available</p>
            <p className="text-sm text-gray-400">
              {activeTab === 'etfs' && 'Configure Alpha Vantage API key for ETF prices'}
              {activeTab === 'crypto' && 'Crypto prices from CoinGecko'}
              {activeTab === 'gold' && 'Configure Gold API key for gold prices'}
            </p>
          </div>
        )}
      </div>

      {/* Your Holdings with Live Growth */}
      {relevantInvestments.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Holdings - Live Growth</h3>
          
          {priceLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Updating your holdings...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relevantInvestments.map((investment) => {
                const growth = calculateGrowth(investment);
                const currentValue = getCurrentMarketValue(investment);
                
                return (
                  <div key={investment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{investment.name}</h4>
                      {growth && getChangeIcon(growth.percentage)}
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatPrice(currentValue)}
                    </div>
                    
                    {growth && (
                      <div className={`text-sm font-medium ${getChangeColor(growth.percentage)}`}>
                        {formatChange(growth.percentage)} ({formatPrice(growth.amount)})
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {investment.quantity} {investment.assetClass === 'XAU' ? 'ounces' : 'units'}
                    </div>
                    
                    {investment.originalPrice && (
                      <div className="text-xs text-gray-400">
                        Original: {formatPrice(investment.originalPrice)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* API Configuration Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          <strong>API Setup Required:</strong> To get real-time prices, you need to:
        </p>
        <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
          <li>Get free API keys from Alpha Vantage (ETFs) and Gold API</li>
          <li>Add them to your .env file as REACT_APP_ALPHA_VANTAGE_KEY and REACT_APP_GOLD_API_KEY</li>
          <li>Crypto prices work without API keys (CoinGecko)</li>
        </ul>
      </div>
    </div>
  );
} 