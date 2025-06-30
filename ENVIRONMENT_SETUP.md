# Environment Setup Guide

This guide will help you set up the required API keys for real-time financial data in your financial allocation app.

## 📁 Create Environment File

Create a `.env` file in the root directory of your project with the following content:

```bash
# API Keys for Financial Data
# Get free API keys from the following services:

# Alpha Vantage API Key (for ETFs and Stocks)
# Sign up at: https://www.alphavantage.co/support/#api-key
REACT_APP_ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key_here

# Gold API Key (for Gold prices)
# Sign up at: https://www.goldapi.io/
REACT_APP_GOLD_API_KEY=your_gold_api_key_here

# Note: Cryptocurrency prices from CoinGecko work without API keys
# No additional configuration needed for crypto prices

# Encryption Key (for data security)
# This should be a 32-character string for AES-256 encryption
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

## 🔑 Getting API Keys

### 1. Alpha Vantage API Key (Free)

**For ETFs and Stocks:**
1. Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Get your API key (free tier: 5 API calls per minute, 500 per day)
4. Replace `your_alpha_vantage_api_key_here` with your actual key

**Example:**
```bash
REACT_APP_ALPHA_VANTAGE_KEY=ABC123DEF456GHI789
```

### 2. Gold API Key (Free)

**For Gold Prices:**
1. Go to [Gold API](https://www.goldapi.io/)
2. Sign up for a free account
3. Get your API key (free tier: 100 requests per month)
4. Replace `your_gold_api_key_here` with your actual key

**Example:**
```bash
REACT_APP_GOLD_API_KEY=xyz789abc123def456
```

### 3. Encryption Key

**For Data Security:**
- Generate a 32-character random string
- You can use the setup script: `npm run setup-encryption`
- Or generate manually: any 32-character string

**Example:**
```bash
ENCRYPTION_KEY=MySecretKey32CharsLongForAES256
```

## 🚀 Quick Setup Commands

### Option 1: Manual Setup
```bash
# Create .env file
cp .env.example .env

# Edit with your API keys
nano .env
```

### Option 2: Using Setup Script
```bash
# Generate encryption key
npm run setup-encryption

# Then manually add API keys to .env
```

## 📋 Complete .env Example

Here's what your complete `.env` file should look like:

```bash
# Alpha Vantage API Key (for ETFs and Stocks)
REACT_APP_ALPHA_VANTAGE_KEY=ABC123DEF456GHI789

# Gold API Key (for Gold prices)
REACT_APP_GOLD_API_KEY=xyz789abc123def456

# Encryption Key (32 characters for AES-256)
ENCRYPTION_KEY=MySecretKey32CharsLongForAES256
```

## 🔍 Testing Your Setup

After setting up your `.env` file:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Check the Live Prices tab** in your app
3. **Add some investments** and see live growth tracking
4. **Look for success messages** in the browser console

## ⚠️ Important Notes

- **Never commit your `.env` file** to version control
- **Keep your API keys secure** and don't share them
- **Free API limits:**
  - Alpha Vantage: 5 calls/minute, 500/day
  - Gold API: 100 requests/month
  - CoinGecko: No API key needed, generous limits

## 🆘 Troubleshooting

### "API key not configured" warnings
- Check that your `.env` file exists in the project root
- Verify the environment variable names are correct
- Restart your development server after changes

### Rate limiting errors
- Free APIs have usage limits
- Wait a few minutes and try again
- Consider upgrading to paid plans for higher limits

### No live prices showing
- Check browser console for errors
- Verify API keys are valid
- Ensure you're connected to the internet

## 📞 Support

If you need help:
1. Check the browser console for error messages
2. Verify your API keys are working on the provider's website
3. Ensure your `.env` file is in the correct location
4. Restart your development server after making changes 