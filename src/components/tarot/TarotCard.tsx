'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TarotCardProps {
  name: string;
  nameZh: string;
  imageUrl: string;
  isReversed: boolean;
  isRevealed: boolean;
  position?: number;
  language?: 'en' | 'zh';
  onClick?: () => void;
  className?: string;
}

export default function TarotCard({
  name,
  nameZh,
  imageUrl,
  isReversed,
  isRevealed,
  position,
  language = 'en',
  onClick,
  className = '',
}: TarotCardProps) {
  const [imageError, setImageError] = useState(false);

  const positionLabels = {
    1: { en: 'Past', zh: '过去' },
    2: { en: 'Present', zh: '现在' },
    3: { en: 'Future', zh: '未来' },
  };

  const displayName = language === 'zh' ? nameZh : name;
  const positionLabel = position ? positionLabels[position as 1 | 2 | 3]?.[language] : null;

  return (
    <div
      className={`tarot-card-container ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`tarot-card ${isRevealed ? 'revealed' : ''} ${isReversed ? 'reversed' : ''}`}>
        {/* Card Back */}
        <div className="card-face card-back">
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-lg shadow-xl p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🌙</div>
              <div className="text-yellow-400 text-sm font-serif">AI Tarot</div>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div className="card-face card-front">
          <div className="w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="relative h-full flex flex-col">
              {/* Card Image */}
              <div className="flex-1 relative bg-gray-100">
                {imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🃏</div>
                      <div className="text-sm">{displayName}</div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={imageUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>

              {/* Card Info */}
              <div className="p-3 bg-white border-t">
                <div className="text-center">
                  {positionLabel && (
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {positionLabel}
                    </div>
                  )}
                  <div className="font-serif font-medium text-gray-900">
                    {displayName}
                  </div>
                  {isReversed && (
                    <div className="text-xs text-indigo-600 mt-1">
                      {language === 'zh' ? '逆位' : 'Reversed'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tarot-card-container {
          perspective: 1000px;
          cursor: ${onClick ? 'pointer' : 'default'};
        }

        .tarot-card {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .tarot-card.revealed {
          transform: rotateY(180deg);
        }

        .tarot-card.reversed .card-front {
          transform: rotateY(180deg) rotateZ(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }

        .card-back {
          transform: rotateY(0deg);
        }

        .card-front {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
