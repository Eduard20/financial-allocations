# Maturity Earnings Feature

## Overview

The Maturity Earnings feature calculates and displays how much money you will earn from bonds and deposits by their maturity dates. This provides a comprehensive view of your fixed-income investments and their projected returns.

## Features

### 1. Summary Cards
- **Total Principal**: Shows the total amount invested in bonds and deposits
- **Total Interest**: Displays the total interest that will be earned
- **Total at Maturity**: Shows the total amount you'll receive at maturity
- **Average Return %**: Displays the average annualized return across all investments

### 2. Interactive Charts

#### Maturity Timeline
- Line chart showing the timeline of maturities
- X-axis shows years to maturity
- Y-axis shows the total amount at maturity in USD
- Helps visualize when your investments will mature

#### Earnings by Currency
- Stacked bar chart showing principal vs interest by currency
- Helps understand currency distribution of your fixed-income investments
- Shows both principal amounts and projected interest earnings

#### Earnings by Maturity Year
- Stacked bar chart grouped by the year investments mature
- Helps plan for cash flow in specific years
- Shows both principal and interest components

### 3. Detailed Table
Comprehensive table showing:
- Investment name and currency
- Principal amount invested
- Interest to be earned
- Total amount at maturity
- Coupon rate
- Maturity date
- Days remaining until maturity
- Annualized return percentage

## How It Works

### Calculation Logic

1. **Filtering**: Only investments with `assetClass` of "Bond" or "Deposit" that have both `maturityDate` and `couponRate` are included

2. **Interest Calculation**:
   ```
   Days to Maturity = Maturity Date - Current Date
   Years to Maturity = Days to Maturity / 365.25
   Total Interest = Principal × (Coupon Rate / 100) × Years to Maturity
   Total at Maturity = Principal + Total Interest
   ```

3. **Annualized Return**:
   ```
   Annualized Return = (Total Interest / Principal / Years to Maturity) × 100
   ```

4. **Currency Conversion**: All amounts are converted to USD for consistent comparison using the exchange rates defined in the application

### Data Requirements

For an investment to appear in maturity earnings calculations, it must have:
- `assetClass`: "Bond" or "Deposit"
- `maturityDate`: A valid date string (YYYY-MM-DD format)
- `couponRate`: A number representing the annual interest rate as a percentage

## Usage

1. Navigate to the "Maturity Earnings" tab in the application
2. View the summary cards for an overview of your fixed-income investments
3. Explore the charts to understand your maturity timeline and currency distribution
4. Review the detailed table for specific investment information

## Example

If you have a bond with:
- Principal: $10,000
- Coupon Rate: 5%
- Maturity Date: 2026-12-31
- Current Date: 2025-01-01

The calculation would be:
- Days to Maturity: 730 days
- Years to Maturity: 2.0 years
- Total Interest: $10,000 × 0.05 × 2.0 = $1,000
- Total at Maturity: $10,000 + $1,000 = $11,000
- Annualized Return: ($1,000 / $10,000 / 2.0) × 100 = 5%

## Benefits

1. **Cash Flow Planning**: See exactly when and how much money you'll receive
2. **Return Analysis**: Compare returns across different investments and currencies
3. **Portfolio Optimization**: Identify opportunities to improve your fixed-income allocation
4. **Risk Management**: Understand the timing of your investment maturities

## Technical Implementation

The feature is implemented as a React component (`MaturityEarnings.tsx`) that:
- Uses React hooks for state management and calculations
- Integrates with Recharts for data visualization
- Provides responsive design for different screen sizes
- Includes proper TypeScript typing for type safety
- Handles edge cases like missing data gracefully 