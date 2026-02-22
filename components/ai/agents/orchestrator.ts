import {
  generatePortfolioWithRetry,
  extractHtml,
  validateHtml,
  type FastGeneratorInput,
} from './fast-generator';
import type { ResumeData } from '../prompts/schemas';

export interface GenerationInput {
  resumeData: ResumeData;
  stylePreset: string;
}

export interface GenerationResult {
  success: boolean;
  html?: string;
  error?: string;
  duration: number;
  attempts?: number;
}

export async function generatePortfolio(
  input: GenerationInput
): Promise<GenerationResult> {
  const startTime = Date.now();

  try {
    console.log('[Orchestrator] Starting generation with style:', input.stylePreset);

    const generatorInput: FastGeneratorInput = {
      resumeData: input.resumeData,
      stylePrompt: input.stylePreset,
    };

    const result = await generatePortfolioWithRetry(generatorInput, 3);

    const duration = Date.now() - startTime;
    console.log(`[Orchestrator] Complete in ${duration}ms, attempts: ${result.attempts}`);

    return {
      success: true,
      html: result.html,
      duration,
      attempts: result.attempts,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Orchestrator] Error:', errorMessage);

    return {
      success: false,
      error: errorMessage,
      duration,
    };
  }
}

export { extractHtml, validateHtml };
export type { FastGeneratorInput };
