import { generatePortfolio, type GenerationInput } from '@/components/ai/agent';
import type { ResumeData } from '@/components/ai/prompts/schemas';

interface GenerateRequest {
  resumeData: ResumeData;
  stylePreset?: string;
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const { resumeData, stylePreset } = body;

    if (!resumeData) {
      return new Response(
        JSON.stringify({ error: 'resumeData is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const input: GenerationInput = {
      resumeData,
      stylePreset: stylePreset || 'Glass Modern\n\nDark theme with glassmorphism cards, gradient accents, modern bento grid layout.',
    };

    const result = await generatePortfolio(input);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ html: result.html }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Generate API] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
