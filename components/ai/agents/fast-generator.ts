import { generateText } from 'ai';
import { hackclub, MODELS } from '../config';
import type { ResumeData } from '../prompts/schemas';
import fs from 'fs';
import path from 'path';

function loadPortfolioPrompt(): string {
  const promptPath = path.join(
    process.cwd(),
    'components',
    'ai',
    'prompts',
    'portfolio-generator.txt'
  );
  try {
    return fs.readFileSync(promptPath, 'utf-8').trim();
  } catch {
    console.warn('[Fast Generator] Portfolio prompt not found');
    return '';
  }
}

export function extractHtml(output: string): string {
  const htmlMatch = output.match(/```(?:html)?\n?([\s\S]*?)\n?```/);
  if (htmlMatch) return htmlMatch[1].trim();
  
  const doctypeIndex = output.indexOf('<!DOCTYPE html>');
  if (doctypeIndex !== -1) {
    return output.slice(doctypeIndex).trim();
  }
  
  const htmlIndex = output.indexOf('<html');
  if (htmlIndex !== -1) {
    return output.slice(htmlIndex).trim();
  }
  
  return output.trim();
}

export function validateHtml(html: string): boolean {
  const trimmed = html.trim();
  return trimmed.startsWith('<!DOCTYPE html>') || trimmed.startsWith('<html');
}

export interface FastGeneratorInput {
  resumeData: ResumeData;
  stylePrompt: string;
}

export interface FastGeneratorResult {
  html: string;
  attempts: number;
}

export async function generatePortfolioFast(
  input: FastGeneratorInput
): Promise<FastGeneratorResult> {
  const systemPrompt = loadPortfolioPrompt();
  
  const userPrompt = `
## RESUME DATA

${JSON.stringify(input.resumeData, null, 2)}

## STYLE DIRECTION

${input.stylePrompt}

---

Generate a complete, stunning, distinctive HTML portfolio for this person. Follow the style direction exactly.

Remember: Start your response with '<!DOCTYPE html>'.
`;

  const result = await generateText({
    model: hackclub(MODELS.coding),
    system: systemPrompt,
    prompt: userPrompt,
  });

  const html = extractHtml(result.text);
  
  return { html, attempts: 1 };
}

export async function generatePortfolioWithRetry(
  input: FastGeneratorInput,
  maxRetries: number = 3
): Promise<FastGeneratorResult> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Fast Generator] Attempt ${attempt}/${maxRetries}`);
      
      const result = await generatePortfolioFast(input);
      
      if (!validateHtml(result.html)) {
        throw new Error(
          `Invalid HTML output. Starts with: ${result.html.slice(0, 100)}...`
        );
      }
      
      console.log(`[Fast Generator] Success on attempt ${attempt}`);
      return { ...result, attempts: attempt };
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[Fast Generator] Attempt ${attempt} failed:`,
        error instanceof Error ? error.message : error
      );
    }
  }
  
  throw new Error(
    `Failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
  );
}
