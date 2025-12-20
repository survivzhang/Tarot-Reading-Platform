import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { createStripeCheckout } from '@/lib/payments/stripe';
import { createAlipayPayment } from '@/lib/payments/alipay';
import { createWeChatPayment } from '@/lib/payments/wechat';
import { calculateReadingsToGrant } from '@/config/payment.config';
import type { TransactionType, Currency, PaymentProvider } from '@prisma/client';

// POST /api/payments/create-order - Create a payment order
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, amount, currency, provider } = await request.json();

    if (!type || !amount || !currency || !provider) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate readings to grant
    const readingsGranted = calculateReadingsToGrant(
      type as TransactionType,
      amount,
      user.region
    );
    const isLifetimeUpgrade = type === 'LIFETIME';

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.userId,
        type: type as TransactionType,
        amount,
        currency: currency as Currency,
        provider: provider as PaymentProvider,
        status: 'PENDING',
        readingsGranted,
        isLifetimeUpgrade,
      },
    });

    // Create payment with appropriate provider
    let paymentResponse;

    if (provider === 'STRIPE') {
      paymentResponse = await createStripeCheckout({
        userId: session.userId,
        amount,
        currency: 'USD',
        transactionId: transaction.id,
      });
    } else if (provider === 'ALIPAY') {
      paymentResponse = await createAlipayPayment({
        userId: session.userId,
        amount,
        currency: 'CNY',
        transactionId: transaction.id,
      });
    } else if (provider === 'WECHAT') {
      paymentResponse = await createWeChatPayment({
        userId: session.userId,
        amount,
        currency: 'CNY',
        transactionId: transaction.id,
      });
    } else {
      return NextResponse.json({ error: 'Invalid payment provider' }, { status: 400 });
    }

    return NextResponse.json(paymentResponse);
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
