import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Investment } from '../types';

interface InvestmentFormProps {
  investment?: Investment; // For editing mode
  onSubmit: (investment: Omit<Investment, 'id' | 'dateAdded'>) => void;
  onCancel: () => void;
}

const COUNTRIES = [
  'United States', 'Armenia', 'UAE'
];

const CURRENCIES = [
  'AMD', 'AED', 'EUR', 'USD'
];

const ASSET_CLASSES = [
  'Stock', 'Bond', 'ETF', 'Mutual Fund', 'Real Estate', 'Commodity',
  'Cryptocurrency', 'Cash', 'Deposit', 'Private Equity', 'Hedge Fund', 'XAU', 'Other'
];

const InvestmentForm: React.FC<InvestmentFormProps> = ({ investment, onSubmit, onCancel }) => {
  const isEditMode = !!investment;
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'USD',
    country: 'United States',
    assetClass: 'Stock',
    transactionDate: '',
    originalPrice: '',
    maturityDate: '',
    couponRate: '',
    quantity: '',
    pricePerUnit: ''
  });

  // Initialize form with investment data if editing
  useEffect(() => {
    if (investment) {
      setFormData({
        name: investment.name,
        amount: investment.amount.toString(),
        currency: investment.currency,
        country: investment.country,
        assetClass: investment.assetClass,
        transactionDate: investment.transactionDate || '',
        originalPrice: investment.originalPrice?.toString() || '',
        maturityDate: investment.maturityDate || '',
        couponRate: investment.couponRate?.toString() || '',
        quantity: investment.quantity?.toString() || '',
        pricePerUnit: investment.pricePerUnit?.toString() || ''
      });
    }
  }, [investment]);

  // Calculate total amount when quantity or price per unit changes
  useEffect(() => {
    if (formData.quantity && formData.pricePerUnit) {
      const quantity = parseFloat(formData.quantity);
      const pricePerUnit = parseFloat(formData.pricePerUnit);
      if (!isNaN(quantity) && !isNaN(pricePerUnit)) {
        const total = quantity * pricePerUnit;
        // Use more precision for very small numbers
        const formattedTotal = total < 0.01 ? total.toFixed(8) : total.toFixed(2);
        setFormData(prev => ({
          ...prev,
          amount: formattedTotal
        }));
      }
    }
  }, [formData.quantity, formData.pricePerUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const investmentData: Omit<Investment, 'id' | 'dateAdded'> = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      country: formData.country,
      assetClass: formData.assetClass
    };

    // Add optional fields if provided
    if (formData.transactionDate) {
      investmentData.transactionDate = formData.transactionDate;
    }
    if (formData.originalPrice) {
      investmentData.originalPrice = parseFloat(formData.originalPrice);
    }
    if (formData.maturityDate) {
      investmentData.maturityDate = formData.maturityDate;
    }
    if (formData.couponRate) {
      investmentData.couponRate = parseFloat(formData.couponRate);
    }
    if (formData.quantity) {
      investmentData.quantity = parseFloat(formData.quantity);
    }
    if (formData.pricePerUnit) {
      investmentData.pricePerUnit = parseFloat(formData.pricePerUnit);
    }

    onSubmit(investmentData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showBondFields = formData.assetClass === 'Bond' || formData.assetClass === 'Deposit';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditMode ? 'Edit Investment' : 'Add New Investment'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Investment Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Apple Inc., Vanguard S&P 500 ETF"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                {formData.assetClass === 'XAU' ? 'Ounces' : 'Quantity'}
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="any"
                min="0"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={formData.assetClass === 'XAU' ? "1.5" : formData.assetClass === 'Cryptocurrency' ? "1000000" : "100"}
              />
            </div>

            <div>
              <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
                {formData.assetClass === 'XAU' ? 'Price per Ounce' : 'Price per Unit'}
              </label>
              <input
                type="number"
                id="pricePerUnit"
                name="pricePerUnit"
                value={formData.pricePerUnit}
                onChange={handleChange}
                step="any"
                min="0"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={formData.assetClass === 'XAU' ? "2000.00" : formData.assetClass === 'Cryptocurrency' ? "0.000009919" : "50.00"}
              />
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Total Amount (Auto-calculated)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="any"
              min="0"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
              placeholder="5000.00"
              required
              readOnly={!!(formData.quantity && formData.pricePerUnit)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="assetClass" className="block text-sm font-medium text-gray-700">
              Investment Type
            </label>
            <select
              id="assetClass"
              name="assetClass"
              value={formData.assetClass}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {ASSET_CLASSES.map(assetClass => (
                <option key={assetClass} value={assetClass}>{assetClass}</option>
              ))}
            </select>
          </div>

          {/* Bond/Deposit specific fields */}
          {showBondFields && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {formData.assetClass === 'Bond' ? 'Bond Details' : 'Deposit Details'}
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maturityDate" className="block text-sm font-medium text-gray-700">
                    Maturity Date
                  </label>
                  <input
                    type="date"
                    id="maturityDate"
                    name="maturityDate"
                    value={formData.maturityDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="couponRate" className="block text-sm font-medium text-gray-700">
                    {formData.assetClass === 'Bond' ? 'Coupon Rate' : 'Interest Rate'} (%)
                  </label>
                  <input
                    type="number"
                    id="couponRate"
                    name="couponRate"
                    value={formData.couponRate}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="5.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Optional fields for growth tracking */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Growth Tracking (Optional)</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
                  Transaction Date
                </label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                  Original Total Price
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  step="any"
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Original total amount"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isEditMode ? 'Update Investment' : 'Add Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm; 