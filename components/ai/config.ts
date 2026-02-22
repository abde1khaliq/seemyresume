import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const HACKCLUB_BASE_URL = 'https://ai.hackclub.com/proxy/v1';

export const hackclub = createOpenRouter({
  apiKey: process.env.HACK_CLUB_AI_API_KEY,
  baseUrl: HACKCLUB_BASE_URL,
});

export const MODELS = {
  coding: 'minimax/minimax-m2.5',
  vision: 'google/gemini-3-flash-preview',
} as const;

export const model = MODELS.coding;

export function getApiKey(): string | undefined {
  return process.env.HACK_CLUB_AI_API_KEY;
}
