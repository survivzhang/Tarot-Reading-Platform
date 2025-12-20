'use client';

import Button from '@/components/ui/Button';
import { getPricingOptions } from '@/config/payment.config';
import type { Region } from '@prisma/client';

interface PricingCardsProps {
  region: Region;
  onSelect: (type: string, amount: number) => void;
  isLoading?: boolean;
}

export default function PricingCards({ region, onSelect, isLoading = false }: PricingCardsProps) {
  const options = getPricingOptions(region);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {options.map((option) => (
        <div
          key={option.type}
          className={`
            relative bg-white rounded-lg shadow-lg p-6 border-2
            ${option.type === 'BUNDLE' ? 'border-indigo-500 transform scale-105' : 'border-gray-200'}
          `}
        >
          {option.type === 'BUNDLE' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </span>
            </div>
          )}

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {option.label}
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">
                {option.amount}
              </span>
              <span className="text-gray-500 ml-1">{option.currency}</span>
            </div>

            <p className="text-sm text-gray-600 mb-6 h-12">
              {option.description}
            </p>

            <Button
              variant={option.type === 'BUNDLE' ? 'primary' : 'outline'}
              size="lg"
              className="w-full"
              onClick={() => onSelect(option.type, option.amount)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Purchase
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
