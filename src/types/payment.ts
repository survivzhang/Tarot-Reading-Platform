import type {
  Transaction,
  TransactionType,
  Currency,
  PaymentProvider,
  PaymentStatus,
} from '@prisma/client';

export type { Transaction, TransactionType, Currency, PaymentProvider, PaymentStatus };

export interface CreatePaymentInput {
  userId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
}

export interface PaymentResponse {
  transactionId: string;
  paymentUrl?: string;
  qrCode?: string; // For Alipay/WeChat
  clientSecret?: string; // For Stripe
}

export interface WebhookPayload {
  providerOrderId: string;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  metadata?: Record<string, unknown>;
}

export interface PricingOption {
  type: TransactionType;
  amount: number;
  currency: Currency;
  readingsGranted?: number;
  isLifetime?: boolean;
  label: string;
  labelZh: string;
  description?: string;
  descriptionZh?: string;
}
