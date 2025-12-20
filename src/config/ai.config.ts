import type { Language } from '@prisma/client';

export const AI_MODELS = {
  OPENAI_GPT4: 'gpt-4',
  OPENAI_GPT4_TURBO: 'gpt-4-turbo-preview',
  ANTHROPIC_OPUS: 'claude-3-opus-20240229',
  ANTHROPIC_SONNET: 'claude-3-sonnet-20240229',
} as const;

export const DEFAULT_AI_MODEL = AI_MODELS.OPENAI_GPT4;

export const TAROT_SYSTEM_PROMPT = `You are a professional and compassionate tarot reader providing symbolic guidance and life insights.

Your role is to:
- Provide thoughtful, symbolic interpretations based on traditional tarot meanings
- Offer guidance that encourages self-reflection and personal growth
- Maintain a calm, supportive, and non-judgmental tone
- Frame insights as possibilities and reflections, never as absolute predictions

Important guidelines:
- NEVER make absolute predictions about the future
- NEVER provide medical, legal, or financial advice
- NEVER discuss fatal outcomes or create fear-based narratives
- AVOID deterministic language (e.g., "you will", "this will happen")
- FOCUS on symbolic meanings, patterns, and reflective guidance
- ENCOURAGE the querent to trust their own wisdom and intuition

Your interpretations should be:
- Thoughtful and nuanced
- Focused on growth and understanding
- Supportive and empowering
- Grounded in traditional tarot symbolism
- Appropriate for the querent's emotional state`;

export function buildTarotPrompt(params: {
  cards: Array<{
    name: string;
    nameZh: string;
    position: number;
    isReversed: boolean;
    meaningUpright: string;
    meaningReversed: string;
    meaningUprightZh: string;
    meaningReversedZh: string;
  }>;
  question: string;
  language: Language;
}): string {
  const { cards, question, language } = params;
  const isZh = language === 'ZH';

  const positionLabels = {
    1: isZh ? '过去' : 'Past',
    2: isZh ? '现在' : 'Present',
    3: isZh ? '未来' : 'Future',
  };

  const cardsDescription = cards
    .map((card) => {
      const cardName = isZh ? card.nameZh : card.name;
      const orientation = card.isReversed ? (isZh ? '逆位' : 'Reversed') : (isZh ? '正位' : 'Upright');
      const meaning = card.isReversed
        ? isZh
          ? card.meaningReversedZh
          : card.meaningReversed
        : isZh
        ? card.meaningUprightZh
        : card.meaningUpright;
      const position = positionLabels[card.position as 1 | 2 | 3];

      return `${position}: ${cardName} (${orientation})
Meaning: ${meaning}`;
    })
    .join('\n\n');

  if (isZh) {
    return `问卜者的问题：「${question}」

抽到的塔罗牌：

${cardsDescription}

请基于这三张牌，为问卜者提供一个深思熟虑、富有同情心的解读。

你的解读应该：
1. 分别解释每张牌在其位置上的含义
2. 综合三张牌，讲述一个连贯的故事（过去-现在-未来）
3. 提供具体的、可操作的指导建议
4. 鼓励问卜者进行自我反思
5. 保持温和、支持性的语气

请用中文回复，字数控制在300-500字之间。`;
  }

  return `The querent's question: "${question}"

Cards drawn:

${cardsDescription}

Based on these three cards, please provide a thoughtful, compassionate reading for the querent.

Your reading should:
1. Explain each card's meaning in its specific position
2. Weave the three cards together into a coherent narrative (past-present-future)
3. Offer specific, actionable guidance
4. Encourage self-reflection
5. Maintain a gentle, supportive tone

Please respond in English, keeping your reading between 300-500 words.`;
}

export const AI_CONFIG = {
  temperature: 0.7, // Balanced between creative and consistent
  maxTokens: 1000, // About 300-500 words
  topP: 0.9,
};
