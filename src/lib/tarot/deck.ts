import { TAROT_CONFIG } from '@/config/tarot.config';
import type { DrawnCardData } from '@/types/tarot';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Determines if a card should be reversed (50% probability)
 */
function isReversed(): boolean {
  return Math.random() < TAROT_CONFIG.REVERSED_PROBABILITY;
}

/**
 * Draws a specified number of unique tarot cards
 * @param count - Number of cards to draw (default: 3)
 * @returns Array of drawn card data with position and reversed status
 */
export function drawCards(count: number = TAROT_CONFIG.CARDS_PER_READING): DrawnCardData[] {
  // Create array of all card IDs (0-77)
  const allCardIds = Array.from({ length: TAROT_CONFIG.TOTAL_CARDS }, (_, i) => i + 1);

  // Shuffle and take the first 'count' cards
  const shuffled = shuffleArray(allCardIds);
  const selectedCardIds = shuffled.slice(0, count);

  // Map to DrawnCardData with position and reversed status
  return selectedCardIds.map((cardId, index) => ({
    cardId,
    position: index + 1, // 1, 2, 3 (Past, Present, Future)
    isReversed: isReversed(),
  }));
}

/**
 * Gets position label (Past/Present/Future) for a given position number
 */
export function getPositionLabel(position: number, language: 'en' | 'zh' = 'en'): string {
  const labels = {
    en: ['Past', 'Present', 'Future'],
    zh: ['过去', '现在', '未来'],
  };

  return labels[language][position - 1] || '';
}
