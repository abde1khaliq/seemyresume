import { tool } from 'ai';
import { z } from 'zod';
import { resumeDataSchema } from './prompts/schemas';

export const parseResumeText = tool({
  description: 'Extract structured data from resume text. Returns name, contact info, experience, projects, skills, and education.',
  inputSchema: z.object({
    text: z.string().describe('The raw text content of the resume'),
  }),
  execute: async ({ text }) => {
    return {
      rawText: text,
      length: text.length,
      status: 'ready for parsing',
    };
  },
});

export const analyzeImage = tool({
  description: 'Analyze a single image and return metadata including type, description, and suggested placement.',
  inputSchema: z.object({
    id: z.string().describe('Unique identifier for the image'),
    base64: z.string().describe('Base64 encoded image data'),
    mimeType: z.string().describe('MIME type of the image (e.g., image/png, image/jpeg)'),
    context: z.string().optional().describe('Additional context about the image'),
  }),
  execute: async ({ id, base64, mimeType, context }) => {
    return {
      id,
      mimeType,
      hasData: base64.length > 0,
      context,
      status: 'ready for analysis',
    };
  },
});

export const generateSection = tool({
  description: 'Generate configuration for a specific portfolio section.',
  inputSchema: z.object({
    type: z.enum(['hero', 'experience', 'projects', 'skills', 'about', 'contact', 'education']).describe('Type of section to generate'),
    resumeData: resumeDataSchema.describe('Parsed resume data to use'),
    imageContext: z.array(z.any()).optional().describe('Relevant image analysis results'),
    userPrompt: z.string().optional().describe('User preferences for this section'),
    order: z.number().optional().describe('Order of this section in the portfolio'),
  }),
  execute: async ({ type, resumeData, imageContext, userPrompt, order }) => {
    return {
      type,
      hasData: !!resumeData,
      hasImages: !!imageContext?.length,
      userPrompt,
      order,
      status: 'ready for generation',
    };
  },
});

export const assemblePortfolio = tool({
  description: 'Combine all sections into final portfolio configuration.',
  inputSchema: z.object({
    sections: z.array(z.any()).describe('All generated sections'),
    theme: z.object({
      theme: z.enum(['dark', 'light', 'system']),
      accentColor: z.string(),
    }).describe('Theme configuration'),
    navigation: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })).describe('Navigation items'),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }).describe('SEO metadata'),
    hero: z.any().describe('Hero section configuration'),
  }),
  execute: async ({ sections, theme, navigation, seo, hero }) => {
    return {
      sectionCount: sections.length,
      theme,
      navigationCount: navigation.length,
      seo,
      hasHero: !!hero,
      status: 'ready for assembly',
    };
  },
});

export const allTools = {
  parseResumeText,
  analyzeImage,
  generateSection,
  assemblePortfolio,
} as const;
