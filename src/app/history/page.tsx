'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { ReadingWithCards } from '@/types/tarot';

export default function HistoryPage() {
  const router = useRouter();
  const [readings, setReadings] = useState<ReadingWithCards[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/history')
      .then((res) => res.json())
      .then((data) => {
        setReadings(data.readings);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching history:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Reading History
            </h1>
            <p className="text-gray-600">
              Your journey through the cards
            </p>
          </div>

          {/* Readings List */}
          {readings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 mb-4">You haven&apos;t had any readings yet</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Your First Reading
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/reading/${reading.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {new Date(reading.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h3>
                      <p className="text-sm text-gray-600 italic line-clamp-2">
                        &quot;{reading.question}&quot;
                      </p>
                    </div>
                    <div>
                      <span
                        className={`
                          px-3 py-1 text-xs font-medium rounded-full
                          ${reading.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                          ${reading.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${reading.status === 'FAILED' ? 'bg-red-100 text-red-800' : ''}
                        `}
                      >
                        {reading.status}
                      </span>
                    </div>
                  </div>

                  {/* Card preview */}
                  <div className="flex gap-2">
                    {reading.drawnCards.map((dc, index) => (
                      <div key={index} className="text-xs text-gray-500">
                        {dc.card.name}
                        {dc.isReversed && ' (R)'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

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
