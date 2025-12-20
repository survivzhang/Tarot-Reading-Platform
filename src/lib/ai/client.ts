import { buildTarotPrompt, TAROT_SYSTEM_PROMPT, AI_CONFIG, DEFAULT_AI_MODEL } from '@/config/ai.config';
import type { Language } from '@prisma/client';

interface InterpretReadingParams {
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
}

/**
 * Calls OpenAI API to interpret a tarot reading
 */
export async function interpretReading(params: InterpretReadingParams): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const userPrompt = buildTarotPrompt(params);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_AI_MODEL,
        messages: [
          {
            role: 'system',
            content: TAROT_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
        top_p: AI_CONFIG.topP,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0]?.message?.content;

    if (!interpretation) {
      throw new Error('No interpretation received from AI');
    }

    return interpretation.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate tarot interpretation');
  }
}

/**
 * Alternative: Anthropic Claude API implementation
 */
export async function interpretReadingWithClaude(params: InterpretReadingParams): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const userPrompt = buildTarotPrompt(params);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
        system: TAROT_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const interpretation = data.content[0]?.text;

    if (!interpretation) {
      throw new Error('No interpretation received from AI');
    }

    return interpretation.trim();
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to generate tarot interpretation');
  }
}
