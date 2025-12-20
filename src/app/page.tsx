'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import CardDrawAnimation from '@/components/tarot/CardDrawAnimation';
import CardRow from '@/components/tarot/CardRow';
import UserInfoForm from '@/components/forms/UserInfoForm';
import SignInForm from '@/components/forms/SignInForm';
import { drawCards } from '@/lib/tarot/deck';
import type { DrawnCardData, TarotCard } from '@/types/tarot';

type DrawingStep = 'intro' | 'drawing' | 'complete' | 'form';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<DrawingStep>('intro');
  const [drawnCards, setDrawnCards] = useState<DrawnCardData[]>([]);
  const [currentDrawIndex, setCurrentDrawIndex] = useState(0);
  const [cardsData, setCardsData] = useState<TarotCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  // Fetch cards data on mount
  useEffect(() => {
    fetch('/api/cards')
      .then((res) => res.json())
      .then((data) => setCardsData(data))
      .catch((error) => console.error('Error fetching cards:', error));
  }, []);

  const handleStartDrawing = () => {
    // Draw 3 cards
    const cards = drawCards(3);
    setDrawnCards(cards);
    setStep('drawing');
    setCurrentDrawIndex(0);
  };

  const handleAnimationComplete = () => {
    if (currentDrawIndex < 2) {
      setCurrentDrawIndex(currentDrawIndex + 1);
    } else {
      setStep('complete');
    }
  };

  const handleContinueToForm = () => {
    setStep('form');
  };

  const handleSubmit = async (data: {
    email: string;
    question: string;
    language: 'EN' | 'ZH';
  }) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          question: data.question,
          language: data.language,
          cards: drawnCards,
        }),
      });

      const result = await response.json();

      if (response.status === 409) {
        // User exists, show sign-in modal
        setShowSignIn(true);
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        // No credits
        router.push('/purchase');
        return;
      }

      if (response.ok) {
        // Redirect to reading page
        router.push(`/reading/${result.readingId}`);
      } else {
        alert(result.error || 'Failed to create reading');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting reading:', error);
      alert('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowSignIn(false);
        // Retry submission
        // You'd need to store the form data to retry here
        alert('Signed in successfully! Please submit your reading again.');
      } else {
        alert('Sign in failed');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('An error occurred');
      setIsLoading(false);
    }
  };

  const getCurrentCard = () => {
    if (currentDrawIndex >= drawnCards.length) return null;
    const drawnCard = drawnCards[currentDrawIndex];
    return cardsData.find((c) => c.id === drawnCard.cardId);
  };

  const getDrawnCardsWithData = () => {
    return drawnCards.map((dc) => ({
      card: cardsData.find((c) => c.id === dc.cardId) || {
        name: 'Unknown',
        nameZh: '未知',
        imageUrl: '/cards/placeholder.jpg',
      },
      position: dc.position,
      isReversed: dc.isReversed,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Intro Step */}
        {step === 'intro' && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">
                AI Tarot Life
              </h1>
              <p className="text-xl text-gray-600">
                Find clarity and guidance through the wisdom of the cards
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              <div className="text-6xl">🌙</div>
              <h2 className="text-2xl font-serif font-semibold text-gray-900">
                Begin Your Journey
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Take a moment to quiet your mind. Think about the question or situation
                that has brought you here. When you&apos;re ready, draw your cards.
              </p>
              <button
                onClick={handleStartDrawing}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
              >
                Draw Cards
              </button>
            </div>
          </div>
        )}

        {/* Drawing Step */}
        {step === 'drawing' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-2">
                Drawing Card {currentDrawIndex + 1} of 3
              </h2>
              <p className="text-gray-600">
                {currentDrawIndex === 0 && 'Past'}
                {currentDrawIndex === 1 && 'Present'}
                {currentDrawIndex === 2 && 'Future'}
              </p>
            </div>

            <div className="flex justify-center">
              {(() => {
                const card = getCurrentCard();
                return card && (
                  <CardDrawAnimation
                    card={card}
                    isReversed={drawnCards[currentDrawIndex].isReversed}
                    position={drawnCards[currentDrawIndex].position}
                    onAnimationComplete={handleAnimationComplete}
                  />
                );
              })()}
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-4">
                Your Cards Have Been Drawn
              </h2>
              <p className="text-gray-600 mb-8">
                These three cards represent your past, present, and future
              </p>
            </div>

            <CardRow cards={getDrawnCardsWithData()} language="en" />

            <div className="text-center">
              <button
                onClick={handleContinueToForm}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
              >
                Continue to Reading
              </button>
            </div>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
              <CardRow cards={getDrawnCardsWithData()} language="en" className="scale-75" />
            </div>

            <UserInfoForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* Sign In Modal */}
        <SignInForm
          isOpen={showSignIn}
          onClose={() => setShowSignIn(false)}
          onSignIn={handleSignIn}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
