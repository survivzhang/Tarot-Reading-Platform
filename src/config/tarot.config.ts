export const TAROT_CONFIG = {
  // Number of cards in a standard reading
  CARDS_PER_READING: 3,

  // Card positions
  POSITIONS: {
    PAST: 1,
    PRESENT: 2,
    FUTURE: 3,
  },

  // Probability of card being reversed (50%)
  REVERSED_PROBABILITY: 0.5,

  // Total number of cards in tarot deck
  TOTAL_CARDS: 78,

  // Major Arcana range
  MAJOR_ARCANA_START: 0,
  MAJOR_ARCANA_END: 21,

  // Minor Arcana ranges
  WANDS_START: 22,
  WANDS_END: 35,
  CUPS_START: 36,
  CUPS_END: 49,
  SWORDS_START: 50,
  SWORDS_END: 63,
  PENTACLES_START: 64,
  PENTACLES_END: 77,

  // User limits
  FREE_READINGS_ON_SIGNUP: 2,
  LIFETIME_YEARLY_LIMIT: 365,

  // Reading status polling
  POLLING_INTERVAL_MS: 2000, // Poll every 2 seconds
  MAX_POLLING_ATTEMPTS: 60, // Max 2 minutes (60 * 2s)
} as const;
