'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { getTipOptions } from '@/config/payment.config';
import type { Region } from '@prisma/client';

interface TipButtonProps {
  region: Region;
  onTip: (amount: number) => void;
  isLoading?: boolean;
}

export default function TipButton({ region, onTip, isLoading = false }: TipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const tipOptions = getTipOptions(region);
  const symbol = region === 'CN' ? '¥' : '$';

  const handleTip = (amount: number) => {
    onTip(amount);
    setIsOpen(false);
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount > 0) {
      handleTip(amount);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
      >
        占卜师辛苦了 💝
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Support the Tarot Reader"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm text-center">
            Show your appreciation with a tip. Tips of {symbol}1 or more earn you a free reading!
          </p>

          {/* Quick tip amounts */}
          <div className="grid grid-cols-2 gap-3">
            {tipOptions.map((option) => (
              <Button
                key={option.amount}
                variant="outline"
                onClick={() => handleTip(option.amount)}
                disabled={isLoading}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Amount
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {symbol}
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="primary"
                onClick={handleCustomTip}
                disabled={!customAmount || isLoading}
                isLoading={isLoading}
              >
                Tip
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
