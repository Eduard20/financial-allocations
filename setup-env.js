#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 Financial Allocations - Environment Setup\n');

const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('If you want to regenerate it, please delete the existing .env file first.\n');
  process.exit(0);
}

// Generate a random 32-character encryption key
const generateEncryptionKey = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Create .env content
const envContent = `# API Keys for Financial Data
# Get free API keys from the following services:

# Alpha Vantage API Key (for ETFs and Stocks)
# Sign up at: https://www.alphavantage.co/support/#api-key
# Free tier: 5 API calls per minute, 500 per day
REACT_APP_ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key_here

# Gold API Key (for Gold prices)
# Sign up at: https://www.goldapi.io/
# Free tier: 100 requests per month
REACT_APP_GOLD_API_KEY=your_gold_api_key_here

# Note: Cryptocurrency prices from CoinGecko work without API keys
# No additional configuration needed for crypto prices

# Encryption Key (32 characters for AES-256 encryption)
# This key is automatically generated for you
ENCRYPTION_KEY=${generateEncryptionKey()}
`;

try {
  // Write .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Get your free API keys:');
  console.log('   • Alpha Vantage: https://www.alphavantage.co/support/#api-key');
  console.log('   • Gold API: https://www.goldapi.io/');
  console.log('');
  console.log('2. Edit the .env file and replace the placeholder values:');
  console.log('   • Replace "your_alpha_vantage_api_key_here" with your Alpha Vantage API key');
  console.log('   • Replace "your_gold_api_key_here" with your Gold API key');
  console.log('');
  console.log('3. Start the application:');
  console.log('   npm run dev');
  console.log('');
  console.log('🔒 Your encryption key has been automatically generated and saved.');
  console.log('💡 Keep your .env file secure and never commit it to version control.');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
} 