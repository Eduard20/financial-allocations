# 🔗 Free API Setup Guide

This guide will help you set up free APIs to get real-time prices for gold, ETFs, and cryptocurrencies in your financial allocation app.

## 🎯 **Available APIs**

### **1. Alpha Vantage (ETFs & Stocks)**
- **Free Tier**: 500 requests/day, 5 API calls per minute
- **Website**: https://www.alphavantage.co/
- **Signup**: Free registration required
- **Coverage**: All major ETFs, stocks, forex, commodities

### **2. CoinGecko (Cryptocurrencies)**
- **Free Tier**: 10,000 calls/month
- **Website**: https://www.coingecko.com/en/api
- **Signup**: No registration required
- **Coverage**: 2,500+ cryptocurrencies

### **3. Gold API (Gold Prices)**
- **Free Tier**: 100 requests/month
- **Website**: https://www.goldapi.io/
- **Signup**: Free registration required
- **Coverage**: Gold, silver, platinum, palladium

## 🚀 **Step-by-Step Setup**

### **Step 1: Get Alpha Vantage API Key**

1. **Visit**: https://www.alphavantage.co/support/#api-key
2. **Sign up** for a free account
3. **Get your API key** (it's free)
4. **Test the API**:
   ```bash
   curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VOO&apikey=YOUR_API_KEY"
   ```

### **Step 2: Get Gold API Key**

1. **Visit**: https://www.goldapi.io/
2. **Sign up** for a free account
3. **Get your access token** (it's free)
4. **Test the API**:
   ```bash
   curl -H "x-access-token: YOUR_TOKEN" -H "Content-Type: application/json" https://www.goldapi.io/api/XAU/USD
   ```

### **Step 3: Configure Environment Variables**

1. **Create/update your `.env` file**:
   ```env
   # Financial Allocations App - API Keys
   REACT_APP_ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
   REACT_APP_GOLD_API_KEY=your_gold_api_token_here
   
   # Encryption Key (from previous setup)
   ENCRYPTION_KEY=your_encryption_key_here
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

2. **Restart your development server**:
   ```bash
   npm run server
   ```

## 📊 **API Usage Examples**

### **Popular ETFs Available**
- **VOO** - Vanguard S&P 500 ETF
- **VTI** - Vanguard Total Stock Market ETF
- **VXUS** - Vanguard Total International Stock ETF
- **QQQ** - Invesco QQQ Trust
- **SPY** - SPDR S&P 500 ETF Trust
- **BND** - Vanguard Total Bond Market ETF
- **VT** - Vanguard Total World Stock ETF

### **Popular Cryptocurrencies Available**
- **BTC** - Bitcoin
- **ETH** - Ethereum
- **ADA** - Cardano
- **BNB** - Binance Coin
- **SOL** - Solana
- **DOT** - Polkadot
- **DOGE** - Dogecoin
- **XRP** - Ripple

### **Gold (XAU)**
- **XAU** - Gold per ounce in USD

## 🔧 **Testing Your Setup**

### **Test Alpha Vantage**
```bash
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VOO&apikey=YOUR_KEY"
```

**Expected Response**:
```json
{
  "Global Quote": {
    "01. symbol": "VOO",
    "05. price": "450.23",
    "09. change": "2.15",
    "10. change percent": "0.48%"
  }
}
```

### **Test Gold API**
```bash
curl -H "x-access-token: YOUR_TOKEN" -H "Content-Type: application/json" https://www.goldapi.io/api/XAU/USD
```

**Expected Response**:
```json
{
  "price_usd": 2045.50,
  "ch_usd": 12.30,
  "ch_usd_percent": 0.60
}
```

### **Test CoinGecko (No API Key Required)**
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
```

**Expected Response**:
```json
{
  "bitcoin": {
    "usd": 45000.50,
    "usd_24h_change": 2.15
  }
}
```

## 📈 **Rate Limits & Best Practices**

### **Alpha Vantage**
- **Limit**: 500 requests/day, 5 per minute
- **Best Practice**: Cache results for 5 minutes
- **Cost**: Free tier is sufficient for personal use

### **Gold API**
- **Limit**: 100 requests/month
- **Best Practice**: Cache results for 1 hour
- **Cost**: Free tier is sufficient for personal use

### **CoinGecko**
- **Limit**: 10,000 calls/month, 50 per minute
- **Best Practice**: Cache results for 5 minutes
- **Cost**: Free tier is generous

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **"API key not configured"**
   - Check your `.env` file exists
   - Verify the environment variable names
   - Restart your development server

2. **"Rate limit exceeded"**
   - Wait for the rate limit to reset
   - Implement better caching
   - Consider upgrading to paid tier

3. **"Network error"**
   - Check your internet connection
   - Verify API endpoints are accessible
   - Check if APIs are experiencing downtime

### **Debug Mode**

Add this to your `.env` file to see API responses:
```env
REACT_APP_DEBUG_API=true
```

## 🔒 **Security Notes**

- ✅ **API keys are stored in `.env` file** (not committed to git)
- ✅ **Rate limiting prevents abuse**
- ✅ **Caching reduces API calls**
- ⚠️ **Never share your API keys publicly**
- ⚠️ **Monitor your API usage**

## 📱 **Using Live Prices in Your App**

Once configured, you can:

1. **View live prices** in the new "Live Prices" component
2. **Click on prices** to auto-fill investment forms
3. **Track price changes** with 24h change indicators
4. **Refresh prices** manually or automatically

## 🎉 **You're Ready!**

After completing this setup, your financial allocation app will have:
- ✅ Real-time ETF prices
- ✅ Live cryptocurrency prices
- ✅ Current gold prices
- ✅ Price change indicators
- ✅ Automatic form filling
- ✅ Cached results for performance

Start your server and enjoy real-time financial data! 🚀 