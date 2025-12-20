import type { TarotCard, DrawnCard, Reading, ReadingStatus, Language } from '@prisma/client';

export type { TarotCard, DrawnCard, Reading, ReadingStatus, Language };

export interface DrawnCardData {
  cardId: number;
  position: number; // 1, 2, or 3
  isReversed: boolean;
}

export interface CreateReadingInput {
  email: string;
  question: string;
  language: Language;
  region: string;
  cards: DrawnCardData[];
  referrerId?: string; // For referral tracking
}

export interface ReadingWithCards extends Reading {
  drawnCards: (DrawnCard & {
    card: TarotCard;
  })[];
  user: {
    email: string;
    region: 'CN' | 'US';
  };
}

export interface CardPosition {
  position: number;
  label: string;
  labelZh: string;
}

export const CARD_POSITIONS: CardPosition[] = [
  { position: 1, label: 'Past', labelZh: '过去' },
  { position: 2, label: 'Present', labelZh: '现在' },
  { position: 3, label: 'Future', labelZh: '未来' },
];
