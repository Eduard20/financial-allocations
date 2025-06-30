// Price fetching service for real-time financial data
// Using free APIs with rate limiting

interface PriceData {
  symbol: string;
  price: number;
  currency: string;
  lastUpdated: string;
  change24h?: number;
  changePercent24h?: number;
}

interface PriceCache {
  [key: string]: {
    data: PriceData;
    timestamp: number;
  };
}

class PriceService {
  private cache: PriceCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests

  // API Keys (you'll need to get these)
  private readonly ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY || '';
  private readonly GOLD_API_KEY = process.env.REACT_APP_GOLD_API_KEY || '';

  // Popular ETFs for quick lookup
  private readonly POPULAR_ETFS = [
    'VOO', 'VTI', 'VXUS', 'QQQ', 'SPY', 'BND', 'VT', 'VEA', 'VWO', 'AGG'
  ];

  // Popular cryptocurrencies
  private readonly POPULAR_CRYPTOS = [
    'bitcoin', 'ethereum', 'cardano', 'binancecoin', 'solana', 'polkadot'
  ];

  /**
   * Get current price for any asset
   */
  async getPrice(symbol: string, assetType: 'ETF' | 'Stock' | 'Cryptocurrency' | 'XAU'): Promise<PriceData | null> {
    const cacheKey = `${symbol}-${assetType}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].data;
    }

    try {
      let priceData: PriceData | null = null;

      switch (assetType) {
        case 'ETF':
        case 'Stock':
          priceData = await this.getStockPrice(symbol);
          break;
        case 'Cryptocurrency':
          priceData = await this.getCryptoPrice(symbol);
          break;
        case 'XAU':
          priceData = await this.getGoldPrice();
          break;
      }

      if (priceData) {
        this.cache[cacheKey] = {
          data: priceData,
          timestamp: Date.now()
        };
      }

      return priceData;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get stock/ETF price from Alpha Vantage
   */
  private async getStockPrice(symbol: string): Promise<PriceData | null> {
    if (!this.ALPHA_VANTAGE_KEY) {
      console.warn('Alpha Vantage API key not configured');
      return null;
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          currency: 'USD',
          lastUpdated: quote['07. latest trading day'],
          change24h: parseFloat(quote['09. change']),
          changePercent24h: parseFloat(quote['10. change percent'].replace('%', ''))
        };
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
    }

    return null;
  }

  /**
   * Get cryptocurrency price from CoinGecko
   */
  private async getCryptoPrice(symbol: string): Promise<PriceData | null> {
    // Map common symbols to CoinGecko IDs
    const symbolMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'ADA': 'cardano',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'DOT': 'polkadot',
      'DOGE': 'dogecoin',
      'XRP': 'ripple',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash'
    };

    const coinId = symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
    
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`;
      const response = await fetch(url);
      const data = await response.json();

      if (data[coinId]) {
        return {
          symbol: symbol.toUpperCase(),
          price: data[coinId].usd,
          currency: 'USD',
          lastUpdated: new Date().toISOString(),
          changePercent24h: data[coinId].usd_24h_change
        };
      }
    } catch (error) {
      console.error('Error fetching crypto price:', error);
    }

    return null;
  }

  /**
   * Get gold price from Gold API
   */
  private async getGoldPrice(): Promise<PriceData | null> {
    if (!this.GOLD_API_KEY) {
      console.warn('Gold API key not configured');
      return null;
    }

    try {
      const url = 'https://www.goldapi.io/api/XAU/USD';
      const response = await fetch(url, {
        headers: {
          'x-access-token': this.GOLD_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();

      return {
        symbol: 'XAU',
        price: data.price_usd,
        currency: 'USD',
        lastUpdated: new Date().toISOString(),
        change24h: data.ch_usd,
        changePercent24h: data.ch_usd_percent
      };
    } catch (error) {
      console.error('Error fetching gold price:', error);
      return null;
    }
  }

  /**
   * Get multiple prices at once
   */
  async getMultiplePrices(assets: Array<{ symbol: string; type: 'ETF' | 'Stock' | 'Cryptocurrency' | 'XAU' }>): Promise<PriceData[]> {
    const results: PriceData[] = [];
    
    for (const asset of assets) {
      const price = await this.getPrice(asset.symbol, asset.type);
      if (price) {
        results.push(price);
      }
      
      // Rate limiting
      await this.delay(this.RATE_LIMIT_DELAY);
    }
    
    return results;
  }

  /**
   * Get popular ETFs prices
   */
  async getPopularETFPrices(): Promise<PriceData[]> {
    const etfAssets = this.POPULAR_ETFS.map(symbol => ({ symbol, type: 'ETF' as const }));
    return this.getMultiplePrices(etfAssets);
  }

  /**
   * Get popular crypto prices
   */
  async getPopularCryptoPrices(): Promise<PriceData[]> {
    const cryptoAssets = this.POPULAR_CRYPTOS.map(symbol => ({ symbol, type: 'Cryptocurrency' as const }));
    return this.getMultiplePrices(cryptoAssets);
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache[key];
    if (!cached) return false;
    
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Delay function for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache)
    };
  }
}

// Export singleton instance
export const priceService = new PriceService();

// Export types
export type { PriceData }; 