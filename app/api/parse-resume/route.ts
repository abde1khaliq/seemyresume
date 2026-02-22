import { generateText, Output } from 'ai';
import { hackclub, MODELS } from '@/components/ai/config';
import { resumeDataSchema, type ResumeData } from '@/components/ai/prompts/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText } = body;

    if (!resumeText || typeof resumeText !== 'string') {
      return Response.json(
        { success: false, error: 'resumeText is required' },
        { status: 400 }
      );
    }

    console.log('[Parse Resume] Starting parse, text length:', resumeText.length);

    const result = await generateText({
      model: hackclub(MODELS.vision),
      system: `You are a resume parsing specialist. Extract structured data from resume text.

## Extraction Rules

1. **Name**: Full name (first and last)
2. **Title/Role**: Current or most recent job title
3. **Contact**: Email, phone, location, website
4. **Summary**: Professional summary (keep concise)
5. **Experience**: For each position include:
   - Company name
   - Role/title
   - Start and end dates (normalize to "MMM YYYY" format)
   - Mark current position with "current: true"
   - Achievements as array of strings (focus on impact)
   - Location if available
6. **Projects**: Name, description, tech stack array, link if available
7. **Skills**: Array of technical skills (normalize names)
8. **Education**: Institution, degree, field, dates

## Important
- Only extract information explicitly present
- No hallucination or placeholder text
- Normalize skill names (e.g., "React.js" → "React")
- Convert dates to "MMM YYYY" format
- Use "Present" for current roles

Output ONLY valid JSON matching the schema. No markdown, no explanation.`,
      prompt: `Parse this resume text into structured JSON:\n\n${resumeText}`,
      output: Output.object({ schema: resumeDataSchema }),
    });

    const resumeData: ResumeData = result.output;

    console.log('[Parse Resume] Success, name:', resumeData.name);

    return Response.json({
      success: true,
      data: resumeData,
    });
  } catch (error) {
    console.error('[Parse Resume] Error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse resume',
      },
      { status: 500 }
    );
  }
}
