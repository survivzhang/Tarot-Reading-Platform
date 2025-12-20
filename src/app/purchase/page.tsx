'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PricingCards from '@/components/payment/PricingCards';
import type { Region } from '@prisma/client';

export default function PurchasePage() {
  const router = useRouter();
  const [region, setRegion] = useState<Region>('US');
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState({ freeReadingsLeft: 0, paidReadingsLeft: 0, totalReadingsAvailable: 0 });

  useEffect(() => {
    // Fetch user credits
    fetch('/api/user/credits')
      .then((res) => res.json())
      .then((data) => setCredits(data))
      .catch((error) => console.error('Error fetching credits:', error));

    // Detect region (simplified - you'd get this from session/user)
    setRegion('US'); // Default to US, update based on user data
  }, []);

  const handleSelect = async (type: string, amount: number) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount,
          currency: region === 'CN' ? 'CNY' : 'USD',
          provider: region === 'CN' ? 'ALIPAY' : 'STRIPE',
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert('Failed to create payment');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Continue your journey of self-discovery
            </p>
            {credits.totalReadingsAvailable > 0 && (
              <p className="text-sm text-gray-500">
                You have {credits.totalReadingsAvailable} reading{credits.totalReadingsAvailable !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>

          {/* Pricing Cards */}
          <PricingCards
            region={region}
            onSelect={handleSelect}
            isLoading={isLoading}
          />

          {/* FAQ */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  What do I get with each reading?
                </h4>
                <p className="text-gray-600 text-sm">
                  Each reading includes a three-card spread (Past, Present, Future) with AI-generated interpretation based on your question.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  How does Lifetime Membership work?
                </h4>
                <p className="text-gray-600 text-sm">
                  Lifetime members can perform up to 365 readings per year. The counter resets annually from your membership start date.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Can I share my referral link?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes! When your friend completes their first reading, you'll both receive 1 free reading.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
