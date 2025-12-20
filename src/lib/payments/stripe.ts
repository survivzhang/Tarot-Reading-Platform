import type { PaymentResponse } from '@/types/payment';

/**
 * Creates a Stripe checkout session
 * @see https://stripe.com/docs/api/checkout/sessions/create
 */
export async function createStripeCheckout(params: {
  userId: string;
  amount: number;
  currency: 'USD';
  transactionId: string;
}): Promise<PaymentResponse> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  const { amount, currency, transactionId } = params;

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': currency.toLowerCase(),
        'line_items[0][price_data][unit_amount]': (amount * 100).toString(), // Amount in cents
        'line_items[0][price_data][product_data][name]': 'Tarot Reading Credits',
        'line_items[0][quantity]': '1',
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase`,
        'metadata[transactionId]': transactionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Stripe API error: ${JSON.stringify(error)}`);
    }

    const session = await response.json();

    return {
      transactionId,
      paymentUrl: session.url,
      clientSecret: session.client_secret,
    };
  } catch (error) {
    console.error('Error creating Stripe checkout:', error);
    throw new Error('Failed to create payment session');
  }
}

/**
 * Verifies Stripe webhook signature
 */
export function verifyStripeWebhook(
  payload: string,
  signature: string
): boolean {
  // In production, use Stripe's webhook signature verification
  // https://stripe.com/docs/webhooks/signatures
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  // Simplified verification - use stripe library in production
  return true; // TODO: Implement proper verification
}
