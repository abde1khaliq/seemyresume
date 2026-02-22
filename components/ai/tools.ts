import { tool } from 'ai';
import { z } from 'zod';
import {
  resumeDataSchema,
  imageTypeSchema,
  imagePlacementSchema,
  themeConfigSchema,
  navigationItemSchema,
  seoSchema,
  heroSectionSchema,
} from './prompts/schemas';
import {
  processDocument,
  analyzeImageWithVision,
  type DocumentAnalysisResult,
  type ImageAnalysisResult,
} from './utils/hackclub-api';

const documentMimeTypeSchema = z.enum([
  'application/pdf',
  'application/x-pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/avif',
]);

export const processDocumentTool = tool({
  description: `Process documents (PDFs, images) with smart detection for optimal extraction.
  
Processing strategy:
- Digital PDFs: Uses native parsing for best quality
- Scanned PDFs/Images: Uses OCR for text extraction
- Preserves tables, headers, and structure

Returns extracted text content and metadata.`,
  inputSchema: z.object({
    url: z.string().url().optional().describe('Public URL to the document'),
    base64: z.string().optional().describe('Base64 encoded document data'),
    mimeType: documentMimeTypeSchema.describe('MIME type of the document'),
    pages: z.array(z.number()).optional().describe('Specific pages to process (0-indexed)'),
    extractPrompt: z.string().optional().describe('Specific extraction instructions'),
  }),
  execute: async ({ url, base64, mimeType, pages, extractPrompt }) => {
    if (!url && !base64) {
      return {
        text: '',
        pages: 0,
        source: 'text' as const,
        isStructured: false,
        metadata: { tablesDetected: false },
      };
    }

    try {
      return await processDocument({
        url,
        base64,
        mimeType,
        pages,
        prompt: extractPrompt,
      });
    } catch (error) {
      console.error('[processDocumentTool] Error:', error);
      return {
        text: '',
        pages: 0,
        source: 'text' as const,
        isStructured: false,
        metadata: { tablesDetected: false },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const analyzeImageTool = tool({
  description: `Analyze images for portfolio context using vision AI (gemini-3-flash).

Detects:
- Image type (profile, project-screenshot, logo, background, certification, other)
- Description of the image content
- Suggested placement in portfolio
- Alt text for accessibility

Returns structured analysis for portfolio integration.`,
  inputSchema: z.object({
    id: z.string().describe('Unique identifier for the image'),
    url: z.string().url().optional().describe('Public URL to the image'),
    base64: z.string().optional().describe('Base64 encoded image data'),
    mimeType: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif']).optional().describe('MIME type of the image'),
  }),
  execute: async ({ id, url, base64, mimeType }) => {
    if (!url && !base64) {
      return {
        id,
        type: 'other' as const,
        description: 'No image data provided',
        suggestedPlacement: 'none' as const,
        altText: '',
        priority: 1,
      };
    }

    try {
      const result = await analyzeImageWithVision({
        imageUrl: url,
        imageBase64: base64,
        mimeType,
      });

      return {
        id,
        ...result,
      };
    } catch (error) {
      console.error('[analyzeImageTool] Error:', error);
      return {
        id,
        type: 'other' as const,
        description: 'Failed to analyze image',
        suggestedPlacement: 'none' as const,
        altText: 'Image',
        priority: 1,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const generateSection = tool({
  description: 'Generate configuration for a specific portfolio section. Uses minimax-m2.5 for code generation.',
  inputSchema: z.object({
    type: z.enum(['hero', 'experience', 'projects', 'skills', 'about', 'contact', 'education']).describe('Type of section to generate'),
    resumeData: resumeDataSchema.describe('Parsed resume data to use'),
    imageContext: z.array(z.object({
      id: z.string(),
      type: imageTypeSchema,
      description: z.string(),
      suggestedPlacement: imagePlacementSchema,
      altText: z.string(),
      priority: z.number().optional(),
    })).optional().describe('Relevant image analysis results'),
    userPrompt: z.string().optional().describe('User preferences for this section'),
    order: z.number().optional().describe('Order of this section in the portfolio'),
  }),
  execute: async ({ type, resumeData, imageContext, userPrompt, order }) => {
    const relevantImages = imageContext?.filter(img => {
      if (type === 'hero') {
        return ['hero-profile', 'hero-background'].includes(img.suggestedPlacement);
      }
      if (type === 'projects') {
        return img.suggestedPlacement === 'project-card';
      }
      if (type === 'about') {
        return img.suggestedPlacement === 'about-section';
      }
      if (type === 'education') {
        return img.suggestedPlacement === 'education-section';
      }
      return false;
    });

    return {
      type,
      hasData: !!resumeData,
      hasImages: !!relevantImages?.length,
      imageCount: relevantImages?.length || 0,
      relevantImages,
      userPrompt,
      order,
      status: 'ready for generation',
    };
  },
});

export const assemblePortfolio = tool({
  description: 'Combine all sections into final portfolio JSON configuration. Validates and merges sections.',
  inputSchema: z.object({
    sections: z.array(z.any()).describe('All generated sections'),
    theme: themeConfigSchema.describe('Theme configuration'),
    navigation: z.array(navigationItemSchema).describe('Navigation items'),
    seo: seoSchema.describe('SEO metadata'),
    hero: heroSectionSchema.describe('Hero section configuration'),
    contact: z.object({
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      website: z.string().optional(),
      social: z.array(z.object({
        platform: z.string(),
        url: z.string(),
      })).optional(),
    }).optional().describe('Contact information'),
  }),
  execute: async ({ sections, theme, navigation, seo, hero, contact }) => {
    const validSections = sections.filter(s => s && s.type);
    
    const orderedSections = validSections
      .map((section, index) => ({
        ...section,
        order: section.order ?? index,
      }))
      .sort((a, b) => a.order - b.order);

    const validNavigation = navigation.filter(n => n.label && n.href);

    const cssVarColor = theme.accentColor.startsWith('#') 
      ? theme.accentColor 
      : `#${theme.accentColor}`;

    return {
      sectionCount: orderedSections.length,
      theme: {
        ...theme,
        accentColor: cssVarColor,
      },
      navigationCount: validNavigation.length,
      seo,
      hasHero: !!hero,
      hasContact: !!contact,
      sections: orderedSections,
      navigation: validNavigation,
      status: 'assembled',
    };
  },
});

export const allTools = {
  processDocument: processDocumentTool,
  analyzeImage: analyzeImageTool,
  generateSection,
  assemblePortfolio,
} as const;

export type { DocumentAnalysisResult, ImageAnalysisResult };
