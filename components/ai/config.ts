import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const hackclub = createOpenRouter({
  apiKey: process.env.HACK_CLUB_AI_API_KEY,
  baseUrl: 'https://ai.hackclub.com/proxy/v1',
});

export const model: string = "minimax/minimax-m2.5";

