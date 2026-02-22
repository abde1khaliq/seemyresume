import type { ResumeData } from '@/components/ai/prompts/schemas';

export interface ParseResumeResult {
  success: boolean;
  data?: ResumeData;
  error?: string;
}

export async function parseResume(resumeText: string): Promise<ParseResumeResult> {
  try {
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to parse resume',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
