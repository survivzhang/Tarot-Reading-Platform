'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CardRow from '@/components/tarot/CardRow';
import InterpretationDisplay from '@/components/reading/InterpretationDisplay';
import ActionButtons from '@/components/reading/ActionButtons';
import type { ReadingWithCards } from '@/types/tarot';

export default function ReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [reading, setReading] = useState<ReadingWithCards | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const response = await fetch(`/api/readings/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch reading');
        }

        const data = await response.json();
        setReading(data);

        // Poll if still pending
        if (data.status === 'PENDING') {
          setTimeout(fetchReading, 2000);
        }
      } catch (err) {
        setError('Failed to load reading');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReading();
  }, [id]);

  const handleTip = async (amount: number) => {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TIP',
          amount,
          currency: reading?.user.region === 'CN' ? 'CNY' : 'USD',
          provider: reading?.user.region === 'CN' ? 'ALIPAY' : 'STRIPE',
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error) {
      console.error('Error creating tip:', error);
      alert('Failed to process tip');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">
            {reading?.status === 'PENDING' ? 'Interpreting your cards...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Reading not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Your Tarot Reading
            </h1>
            <p className="text-gray-600">
              {new Date(reading.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Cards */}
          <CardRow
            cards={reading.drawnCards.map((dc) => ({
              card: dc.card,
              position: dc.position,
              isReversed: dc.isReversed,
            }))}
            language={reading.language === 'ZH' ? 'zh' : 'en'}
          />

          {/* Question */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Question</h2>
            <p className="text-gray-700 italic">&quot;{reading.question}&quot;</p>
          </div>

          {/* Interpretation */}
          {reading.status === 'COMPLETED' && reading.interpretation ? (
            <>
              <InterpretationDisplay interpretation={reading.interpretation} />

              <ActionButtons
                region={reading.user.region}
                onTip={handleTip}
                hasCreditsLeft={true} // You'd fetch this from user credits API
              />
            </>
          ) : reading.status === 'FAILED' ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">
                Failed to generate interpretation. Please try again later.
              </p>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
              <LoadingSpinner />
              <p className="mt-4 text-indigo-900">
                The cards are being interpreted... This may take a moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
