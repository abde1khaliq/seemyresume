import { tool } from 'ai';
import { z } from 'zod';
import { processDocument, analyzeImageWithVision } from './utils/hackclub-api';

export const processDocumentTool = tool({
  description: 'Extract text content from PDF documents or images. Use only when user provides a PDF or image file that needs text extraction.',
  inputSchema: z.object({
    url: z.string().url().optional().describe('Public URL to the document'),
    base64: z.string().optional().describe('Base64 encoded document data'),
    mimeType: z.enum([
      'application/pdf',
      'application/x-pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/avif',
    ]).describe('MIME type of the document'),
  }),
  execute: async ({ url, base64, mimeType }) => {
    if (!url && !base64) {
      return { text: '', error: 'No document data provided' };
    }

    try {
      const result = await processDocument({
        url,
        base64,
        mimeType,
      });
      return { text: result.text, source: result.source };
    } catch (error) {
      return { 
        text: '', 
        error: error instanceof Error ? error.message : 'Failed to process document' 
      };
    }
  },
});

export const analyzeImageTool = tool({
  description: 'Analyze an image for portfolio context. Detects type, description, and suggests placement. Use for each image provided by the user.',
  inputSchema: z.object({
    id: z.string().describe('Unique identifier for the image'),
    url: z.string().url().optional().describe('Public URL to the image'),
    base64: z.string().optional().describe('Base64 encoded image data'),
    mimeType: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif']).optional(),
  }),
  execute: async ({ id, url, base64, mimeType }) => {
    if (!url && !base64) {
      return { 
        id, 
        type: 'other', 
        description: 'No image data provided', 
        suggestedPlacement: 'none',
        altText: '',
      };
    }

    try {
      const result = await analyzeImageWithVision({
        imageUrl: url,
        imageBase64: base64,
        mimeType,
      });
      return { id, ...result };
    } catch (error) {
      return { 
        id, 
        type: 'other', 
        description: 'Failed to analyze image', 
        suggestedPlacement: 'none',
        altText: 'Image',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const allTools = {
  processDocument: processDocumentTool,
  analyzeImage: analyzeImageTool,
} as const;
