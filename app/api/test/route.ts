import { portfolioAgent } from '@/components/ai/agent';
import { resumeDataSchema, portfolioConfigSchema } from '@/components/ai/prompts/schemas';

interface TestRequest {
  resumeText?: string;
  images?: Array<{
    id: string;
    base64: string;
    mimeType: string;
  }>;
  prompt?: string;
}

function buildTestPrompt(options: TestRequest): string {
  const { resumeText, images, prompt } = options;
  const parts: string[] = [];

  if (resumeText) {
    parts.push('## Resume\n');
    parts.push(resumeText);
    parts.push('\n');
  }

  if (images && images.length > 0) {
    parts.push('## Images\n');
    parts.push(`${images.length} image(s) provided:\n`);
    images.forEach((img, i) => {
      parts.push(`- Image ${i + 1}: ${img.mimeType} (${img.id})\n`);
    });
    parts.push('\n');
  }

  if (prompt) {
    parts.push('## User Preferences\n');
    parts.push(prompt);
    parts.push('\n');
  }

  parts.push('\nGenerate the portfolio configuration.');

  return parts.join('');
}

export async function POST(request: Request) {
  try {
    const body: TestRequest = await request.json();
    const { resumeText, images, prompt } = body;

    if (!resumeText && !images && !prompt) {
      return Response.json({
        error: 'Provide at least one of: resumeText, images, or prompt',
        example: {
          resumeText: 'John Doe\nSoftware Engineer\n...',
          prompt: 'Dark mode, minimalist',
        },
      }, { status: 400 });
    }

    const testPrompt = buildTestPrompt({ resumeText, images, prompt });

    console.log('[Test API] Starting generation...');
    console.log('[Test API] Prompt length:', testPrompt.length);

    const startTime = Date.now();

    const result = await portfolioAgent.generate({
      prompt: testPrompt,
      onStepFinish: ({ stepNumber, usage, toolCalls }) => {
        console.log(`[Test API] Step ${stepNumber} finished`, {
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          toolsUsed: toolCalls?.map(tc => tc.toolName),
        });
      },
      onFinish: ({ totalUsage, steps }) => {
        console.log('[Test API] Generation complete', {
          totalTokens: totalUsage.totalTokens,
          totalSteps: steps.length,
          duration: Date.now() - startTime,
        });
      },
    });

    const output = result.output;

    const validation = portfolioConfigSchema.safeParse(output);

    return Response.json({
      success: true,
      duration: Date.now() - startTime,
      steps: result.steps.length,
      usage: result.totalUsage,
      output,
      validation: validation.success 
        ? { valid: true }
        : { valid: false, errors: validation.error.issues },
    });
  } catch (error) {
    console.error('[Test API] Error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    name: 'Portfolio Generator Test API',
    description: 'Non-streaming endpoint for testing the portfolio agent',
    usage: {
      method: 'POST',
      body: {
        resumeText: 'string (optional) - Resume text content',
        images: 'Array<{ id, base64, mimeType }> (optional) - Images to analyze',
        prompt: 'string (optional) - Style preferences',
      },
      example: {
        resumeText: 'John Doe\nSoftware Engineer\n5 years experience...',
        prompt: 'Dark mode, minimalist, highlight projects',
      },
    },
    endpoints: {
      'POST /api/test': 'Run generation and get result',
      'POST /api/generate': 'Streaming endpoint for client use',
    },
  });
}
