import { generatePortfolio, type GenerationInput } from '@/components/ai/agent';
import type { ResumeData } from '@/components/ai/prompts/schemas';

interface TestRequest {
  resumeData?: ResumeData;
  stylePreset?: string;
}

export async function POST(request: Request) {
  try {
    const body: TestRequest = await request.json();
    const { resumeData, stylePreset } = body;

    if (!resumeData) {
      return Response.json(
        {
          success: false,
          error: 'resumeData is required. Parse the resume first using /api/parse-resume',
        },
        { status: 400 }
      );
    }

    console.log('[Test API] Starting generation...');
    console.log('[Test API] Name:', resumeData.name);
    console.log('[Test API] Style:', stylePreset || 'glass (default)');

    const input: GenerationInput = {
      resumeData,
      stylePreset: stylePreset || 'Glass Modern\n\nDark theme with glassmorphism cards, gradient accents, modern bento grid layout.',
    };

    const startTime = Date.now();
    const result = await generatePortfolio(input);
    const duration = Date.now() - startTime;

    console.log('[Test API] Generation complete:', {
      duration: `${duration}ms`,
      success: result.success,
      attempts: result.attempts,
    });

    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: result.error,
          duration: result.duration,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      duration: result.duration,
      attempts: result.attempts,
      output: result.html,
    });
  } catch (error) {
    console.error('[Test API] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.stack : undefined
          : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    name: 'Portfolio Generator API',
    version: '4.0',
    description: 'Fast single-call portfolio generation with style presets',
    architecture: {
      approach: 'Single LLM call for fast generation (35-70s)',
      steps: [
        '1. Client parses resume via /api/parse-resume (5-10s)',
        '2. Client sends resumeData + stylePreset to /api/test',
        '3. Server generates HTML in single call (30-60s)',
        '4. Retry logic (max 3 attempts) if needed',
      ],
    },
    stylePresets: ['glass', 'terminal', 'creative', 'minimal'],
    usage: {
      method: 'POST',
      body: {
        resumeData: 'ResumeData object (from /api/parse-resume)',
        stylePreset: 'Style prompt string (optional, defaults to Glass Modern)',
      },
    },
    endpoints: {
      'POST /api/parse-resume': 'Parse resume text to structured data',
      'POST /api/test': 'Generate portfolio HTML',
    },
  });
}
