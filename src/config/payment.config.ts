import type { Region, TransactionType, Currency } from '@prisma/client';
import type { PricingOption } from '@/types/payment';

interface RegionalPricing {
  TIP: number[];
  SINGLE: { price: number; readings: number };
  BUNDLE: { price: number; readings: number };
  LIFETIME: { price: number; yearlyLimit: number };
}

export const PRICING: Record<Region, RegionalPricing> = {
  CN: {
    TIP: [1, 5],
    SINGLE: { price: 2, readings: 1 },
    BUNDLE: { price: 10, readings: 10 },
    LIFETIME: { price: 99, yearlyLimit: 365 },
  },
  US: {
    TIP: [1, 5],
    SINGLE: { price: 1, readings: 1 },
    BUNDLE: { price: 5, readings: 10 },
    LIFETIME: { price: 99, yearlyLimit: 365 },
  },
};

export function getPricingOptions(region: Region): PricingOption[] {
  const pricing = PRICING[region];
  const currency: Currency = region === 'CN' ? 'CNY' : 'USD';
  const symbol = region === 'CN' ? '¥' : '$';

  return [
    {
      type: 'SINGLE',
      amount: pricing.SINGLE.price,
      currency,
      readingsGranted: pricing.SINGLE.readings,
      label: `${symbol}${pricing.SINGLE.price} - Single Reading`,
      labelZh: `${symbol}${pricing.SINGLE.price} - 单次占卜`,
      description: `Get 1 tarot reading`,
      descriptionZh: `获得1次塔罗占卜`,
    },
    {
      type: 'BUNDLE',
      amount: pricing.BUNDLE.price,
      currency,
      readingsGranted: pricing.BUNDLE.readings,
      label: `${symbol}${pricing.BUNDLE.price} - 10 Readings`,
      labelZh: `${symbol}${pricing.BUNDLE.price} - 10次占卜`,
      description: `Best value! Get 10 readings`,
      descriptionZh: `最超值！获得10次占卜`,
    },
    {
      type: 'LIFETIME',
      amount: pricing.LIFETIME.price,
      currency,
      isLifetime: true,
      label: `${symbol}${pricing.LIFETIME.price} - Lifetime Membership`,
      labelZh: `${symbol}${pricing.LIFETIME.price} - 终身会员`,
      description: `Unlimited readings (up to ${pricing.LIFETIME.yearlyLimit}/year)`,
      descriptionZh: `无限次占卜（每年最多${pricing.LIFETIME.yearlyLimit}次）`,
    },
  ];
}

export function getTipOptions(region: Region): PricingOption[] {
  const pricing = PRICING[region];
  const currency: Currency = region === 'CN' ? 'CNY' : 'USD';
  const symbol = region === 'CN' ? '¥' : '$';

  return pricing.TIP.map((amount) => ({
    type: 'TIP',
    amount,
    currency,
    readingsGranted: amount >= 1 ? 1 : 0,
    label: `${symbol}${amount}`,
    labelZh: `${symbol}${amount}`,
    description: amount >= 1 ? 'Get 1 free reading' : '',
    descriptionZh: amount >= 1 ? '获得1次免费占卜' : '',
  }));
}

export function calculateReadingsToGrant(type: TransactionType, amount: number, region: Region): number {
  const pricing = PRICING[region];

  switch (type) {
    case 'TIP':
      return amount >= 1 ? 1 : 0;
    case 'SINGLE':
      return pricing.SINGLE.readings;
    case 'BUNDLE':
      return pricing.BUNDLE.readings;
    case 'LIFETIME':
      return 0; // Handled by isLifetimeMember flag
    default:
      return 0;
  }
}
