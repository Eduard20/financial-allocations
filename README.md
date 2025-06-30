# Financial Allocations Tracker

A modern web application for tracking your investments across different countries, currencies, and asset types with beautiful visualizations, real-time price tracking, and analytics.

## Features

- **Investment Management**: Add, view, edit, and delete investments with detailed information
- **Real-Time Price Tracking**: Live market prices for ETFs, stocks, cryptocurrencies, and gold
- **Growth Analytics**: Track investment performance with real-time growth calculations
- **Multi-dimensional Tracking**: Track investments by country, currency, asset type, and asset class
- **Interactive Dashboard**: Beautiful pie charts showing asset class and geographic allocations
- **Portfolio Analytics**: Real-time statistics and percentage breakdowns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Data Storage**: Encrypted JSON file storage with Node.js backend
- **Live Market Data**: Integration with free financial APIs

## Investment Categories

### Countries
- United States, Canada, United Kingdom, Germany, France, Japan, Australia, Switzerland, Netherlands, Sweden, Norway, Denmark, Singapore, Hong Kong, China, India, Brazil, Mexico, South Africa, and more

### Currencies
- USD, EUR, GBP, JPY, CAD, AUD, CHF, SEK, NOK, DKK, SGD, HKD, CNY, INR, BRL, MXN, ZAR

### Asset Types
- Stock, Bond, ETF, Mutual Fund, Real Estate, Commodity, Cryptocurrency, Cash, Private Equity, Hedge Fund

### Asset Classes
- Equity, Fixed Income, Real Estate, Commodities, Cash, Alternative Investments, International, Emerging Markets

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

**For Live Price Features:**

1. Create a `.env` file in the project root (see `ENVIRONMENT_SETUP.md` for detailed instructions)
2. Add your API keys:
   ```bash
   # Alpha Vantage API Key (for ETFs and Stocks)
   REACT_APP_ALPHA_VANTAGE_KEY=your_api_key_here
   
   # Gold API Key (for Gold prices)
   REACT_APP_GOLD_API_KEY=your_api_key_here
   
   # Encryption Key (32 characters for data security)
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```

3. Get free API keys:
   - **Alpha Vantage**: [Sign up here](https://www.alphavantage.co/support/#api-key) (5 calls/minute, 500/day free)
   - **Gold API**: [Sign up here](https://www.goldapi.io/) (100 requests/month free)
   - **Crypto**: No API key needed (CoinGecko)

### Running the Application

1. Start both frontend and backend:
   ```bash
   npm run dev
   ```

2. Or run them separately:
   ```bash
   # Backend (port 3001)
   npm run server
   
   # Frontend (port 3000)
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

4. Start adding your investments and explore the dashboard!

### Building for Production

To create a production build:
```bash
npm run build
```

## Usage

### Adding Investments
1. Click the "Add Investment" button in the header
2. Fill in the investment details:
   - Name (e.g., "Apple Inc.", "Vanguard S&P 500 ETF", "Bitcoin")
   - Amount in your chosen currency
   - Country where the investment is located
   - Asset type and class
   - Quantity and price per unit (optional)
   - Original price (for growth tracking)
3. Click "Add Investment" to save

### Live Price Features
- **Live Prices Tab**: View real-time market prices for popular assets
- **Growth Tracking**: See live growth percentages and amounts for your investments
- **Market Overview**: Browse popular ETFs, cryptocurrencies, and gold prices
- **Auto-Refresh**: Prices update automatically every 5 minutes

### Viewing Analytics
- **Dashboard Tab**: View pie charts showing your asset class and geographic allocations with live values
- **Investments Tab**: See a detailed list of all your investments with growth tracking
- **Portfolio Tab**: Interactive charts with current market values
- **Live Prices Tab**: Real-time market data and your holdings growth
- **Summary Cards**: Quick overview of total value, growth, number of investments, countries, and asset classes

### Managing Investments
- Edit investments using the edit icon in the investments list
- Delete investments using the trash icon
- All changes are automatically saved to the encrypted backend storage

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Data Storage**: Encrypted JSON files
- **APIs**: Alpha Vantage, CoinGecko, Gold API

## Data Storage

Investment data is stored securely using:
- **Encrypted JSON files** on the backend
- **AES-256-CBC encryption** for data security
- **Automatic backups** and migration support
- **Environment-based encryption keys**

## API Integration

The app integrates with free financial APIs:
- **Alpha Vantage**: Real-time stock and ETF prices
- **CoinGecko**: Cryptocurrency prices (no API key required)
- **Gold API**: Gold prices and precious metals data

## Contributing

Feel free to fork this project and submit pull requests for any improvements or new features!

## License

This project is open source and available under the MIT License. 