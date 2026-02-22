import { createAgentUIStreamResponse } from 'ai';
import { portfolioAgent } from '@/components/ai/agent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return createAgentUIStreamResponse({
      agent: portfolioAgent,
      uiMessages: messages,
    });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate portfolio' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
