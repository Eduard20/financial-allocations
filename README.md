# Financial Allocations Tracker

A modern web application for tracking your investments across different countries, currencies, and asset types with beautiful visualizations and analytics.

## Features

- **Investment Management**: Add, view, and delete investments with detailed information
- **Multi-dimensional Tracking**: Track investments by country, currency, asset type, and asset class
- **Interactive Dashboard**: Beautiful pie charts showing asset class and geographic allocations
- **Portfolio Analytics**: Real-time statistics and percentage breakdowns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Your data is saved locally in your browser

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

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Start adding your investments and explore the dashboard!

### Building for Production

To create a production build:
```bash
npm run build
```

## Usage

### Adding Investments
1. Click the "Add Investment" button in the header
2. Fill in the investment details:
   - Name (e.g., "Apple Inc.", "Vanguard S&P 500 ETF")
   - Amount in your chosen currency
   - Country where the investment is located
   - Asset type and class
3. Click "Add Investment" to save

### Viewing Analytics
- **Dashboard Tab**: View pie charts showing your asset class and geographic allocations
- **Investments Tab**: See a detailed list of all your investments
- **Summary Cards**: Quick overview of total value, number of investments, countries, and asset classes

### Managing Investments
- Delete investments using the trash icon in the investments list
- All changes are automatically saved to your browser's local storage

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Data Storage

All investment data is stored locally in your browser using localStorage. This means:
- Your data stays private and on your device
- No account creation required
- Data persists between browser sessions
- No internet connection needed after initial load

## Contributing

Feel free to fork this project and submit pull requests for any improvements or new features!

## License

This project is open source and available under the MIT License. 