'use client';

interface CardDeckProps {
  cardsRemaining: number;
  onDraw: () => void;
  disabled?: boolean;
}

export default function CardDeck({ cardsRemaining, onDraw, disabled = false }: CardDeckProps) {
  return (
    <div className="relative">
      <button
        onClick={onDraw}
        disabled={disabled || cardsRemaining === 0}
        className={`
          relative w-48 h-72 rounded-lg transition-all duration-300
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}
        `}
      >
        {/* Stack effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 rounded-lg shadow-lg transform translate-x-1 translate-y-1 opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 rounded-lg shadow-lg transform translate-x-0.5 translate-y-0.5 opacity-50"></div>

        {/* Main deck */}
        <div className="relative w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-lg shadow-2xl p-6 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-7xl mb-4">🌙</div>
            <div className="text-yellow-400 text-xl font-serif mb-2">AI Tarot</div>
            <div className="text-white text-sm opacity-75">
              {cardsRemaining > 0 ? 'Draw a Card' : 'No cards left'}
            </div>
          </div>

          {/* Card counter */}
          {cardsRemaining > 0 && (
            <div className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">{cardsRemaining}</span>
            </div>
          )}
        </div>
      </button>

      {!disabled && cardsRemaining > 0 && (
        <div className="text-center mt-4 text-gray-600 text-sm animate-pulse">
          Click to draw
        </div>
      )}
    </div>
  );
}
