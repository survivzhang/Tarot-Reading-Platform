'use client';

import { useState, useEffect } from 'react';
import TarotCard from './TarotCard';

interface CardDrawAnimationProps {
  card: {
    name: string;
    nameZh: string;
    imageUrl: string;
  };
  isReversed: boolean;
  position: number;
  language?: 'en' | 'zh';
  onAnimationComplete?: () => void;
}

export default function CardDrawAnimation({
  card,
  isReversed,
  position,
  language = 'en',
  onAnimationComplete,
}: CardDrawAnimationProps) {
  const [isDrawing, setIsDrawing] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    // Drawing animation (slide from deck)
    const drawTimer = setTimeout(() => {
      setIsDrawing(false);
      setIsRevealing(true);
    }, 500);

    // Reveal animation (flip card)
    const revealTimer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 1500);

    return () => {
      clearTimeout(drawTimer);
      clearTimeout(revealTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div className="relative w-48 h-72">
      <div
        className={`
          transition-all duration-500 ease-out
          ${isDrawing ? 'opacity-0 -translate-x-96' : 'opacity-100 translate-x-0'}
        `}
      >
        <TarotCard
          name={card.name}
          nameZh={card.nameZh}
          imageUrl={card.imageUrl}
          isReversed={isReversed}
          isRevealed={isRevealing}
          position={position}
          language={language}
        />
      </div>
    </div>
  );
}
