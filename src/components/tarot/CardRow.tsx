'use client';

import TarotCard from './TarotCard';


interface CardRowProps {
  cards: Array<{
    card: {
      name: string;
      nameZh: string;
      imageUrl: string;
    };
    position: number;
    isReversed: boolean;
  }>;
  language?: 'en' | 'zh';
  className?: string;
}

export default function CardRow({ cards, language = 'en', className = '' }: CardRowProps) {
  return (
    <div className={`flex items-center justify-center gap-4 md:gap-8 ${className}`}>
      {cards.map((drawnCard, index) => (
        <div key={index} className="w-32 h-48 md:w-40 md:h-60">
          <TarotCard
            name={drawnCard.card.name}
            nameZh={drawnCard.card.nameZh}
            imageUrl={drawnCard.card.imageUrl}
            isReversed={drawnCard.isReversed}
            isRevealed={true}
            position={drawnCard.position}
            language={language}
          />
        </div>
      ))}
    </div>
  );
}
