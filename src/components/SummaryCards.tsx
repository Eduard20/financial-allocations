import React from 'react';
import { DollarSign, Building2, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { SummaryStats } from '../types';

interface SummaryCardsProps {
  stats: SummaryStats;
  currencyFilter: 'original' | 'USD';
  formatCurrency: (value: number) => string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, currencyFilter, formatCurrency }) => {
  const cards = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Investments',
      value: stats.totalInvestments.toString(),
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Countries',
      value: stats.countries.length.toString(),
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Asset Classes',
      value: stats.assetClasses.length.toString(),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Add growth card if growth data is available
  if (stats.totalGrowth !== undefined && stats.averageGrowth !== undefined) {
    cards.push({
      title: 'Portfolio Growth',
      value: `${stats.averageGrowth >= 0 ? '+' : ''}${stats.averageGrowth.toFixed(1)}%`,
      icon: stats.averageGrowth >= 0 ? TrendingUp : TrendingDown,
      color: stats.averageGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.averageGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
                  <IconComponent className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards; 