import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('../components/ai/config', () => ({
  getApiKey: () => 'test-api-key',
  HACKCLUB_BASE_URL: 'https://ai.hackclub.com/proxy/v1',
  MODELS: { coding: 'minimax/minimax-m2.5', vision: 'google/gemini-3-flash-preview' },
}));

describe('Hack Club API Client', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  describe('ocrDocument', () => {
    it('should call OCR API with image URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          model: 'mistral-ocr-latest',
          pages: [{ index: 0, markdown: '# Test Document\n\nContent here', images: [], dimensions: { width: 800, height: 600 } }],
          usage_info: { pages_processed: 1, doc_size_bytes: 1024 },
        }),
      });

      const { ocrDocument } = await import('../components/ai/utils/hackclub-api');
      
      const result = await ocrDocument({
        documentUrl: 'https://example.com/image.png',
        mimeType: 'image/png',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ai.hackclub.com/proxy/v1/ocr',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      );
      
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].markdown).toContain('Test Document');
    });

    it('should call OCR API with base64 data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          model: 'mistral-ocr-latest',
          pages: [{ index: 0, markdown: 'Extracted text', images: [], dimensions: { width: 800, height: 600 } }],
          usage_info: { pages_processed: 1, doc_size_bytes: 1024 },
        }),
      });

      const { ocrDocument } = await import('../components/ai/utils/hackclub-api');
      
      const result = await ocrDocument({
        documentBase64: 'base64data',
        mimeType: 'application/pdf',
      });

      expect(result.pages[0].markdown).toBe('Extracted text');
    });

    it('should handle errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      const { ocrDocument } = await import('../components/ai/utils/hackclub-api');
      
      await expect(ocrDocument({
        documentUrl: 'https://example.com/doc.pdf',
        mimeType: 'application/pdf',
      })).rejects.toThrow('Hack Club API error');
    });
  });

  describe('sendPDFToModel', () => {
    it('should call chat completions with file content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Extracted resume data' } }],
        }),
      });

      const { sendPDFToModel } = await import('../components/ai/utils/hackclub-api');
      
      const result = await sendPDFToModel({
        pdfUrl: 'https://example.com/resume.pdf',
        prompt: 'Extract resume data',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ai.hackclub.com/proxy/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
        })
      );
      
      expect(result).toBe('Extracted resume data');
    });
  });

  describe('sendImageToVision', () => {
    it('should call chat completions with image content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '{"type": "profile", "description": "Test"}' } }],
        }),
      });

      const { sendImageToVision } = await import('../components/ai/utils/hackclub-api');
      
      const result = await sendImageToVision({
        imageUrl: 'https://example.com/image.png',
        prompt: 'Analyze this image',
      });

      expect(result).toContain('type');
    });
  });

  describe('analyzeImageWithVision', () => {
    it('should return structured analysis', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"type": "profile", "description": "Professional headshot", "suggestedPlacement": "hero-profile", "altText": "Profile photo"}',
            },
          }],
        }),
      });

      const { analyzeImageWithVision } = await import('../components/ai/utils/hackclub-api');
      
      const result = await analyzeImageWithVision({
        imageUrl: 'https://example.com/profile.png',
      });

      expect(result.type).toBe('profile');
      expect(result.suggestedPlacement).toBe('hero-profile');
      expect(result.priority).toBe(10);
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'This is just plain text, not JSON' } }],
        }),
      });

      const { analyzeImageWithVision } = await import('../components/ai/utils/hackclub-api');
      
      const result = await analyzeImageWithVision({
        imageUrl: 'https://example.com/image.png',
      });

      expect(result.type).toBe('other');
      expect(result.description).toContain('plain text');
    });
  });

  describe('processDocument', () => {
    it('should process PDF with native parsing first', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'John Doe\nSoftware Engineer\n5 years experience with React and Node.js. Worked at Tech Corp building scalable applications.' } }],
        }),
      });

      const { processDocument } = await import('../components/ai/utils/hackclub-api');
      
      const result = await processDocument({
        url: 'https://example.com/resume.pdf',
        mimeType: 'application/pdf',
      });

      expect(result.source).toBe('pdf-native');
      expect(result.text).toContain('John Doe');
    });

    it('should fall back to OCR when native parsing produces poor results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'ab' } }],
        }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          model: 'mistral-ocr-latest',
          pages: [{ index: 0, markdown: 'Full resume content extracted via OCR', images: [], dimensions: { width: 800, height: 600 } }],
          usage_info: { pages_processed: 1, doc_size_bytes: 1024 },
        }),
      });

      const { processDocument } = await import('../components/ai/utils/hackclub-api');
      
      const result = await processDocument({
        url: 'https://example.com/scanned.pdf',
        mimeType: 'application/pdf',
      });

      expect(result.source).toBe('ocr');
    });

    it('should use OCR for images', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          model: 'mistral-ocr-latest',
          pages: [{ index: 0, markdown: 'Text from image', images: [], dimensions: { width: 800, height: 600 } }],
          usage_info: { pages_processed: 1, doc_size_bytes: 1024 },
        }),
      });

      const { processDocument } = await import('../components/ai/utils/hackclub-api');
      
      const result = await processDocument({
        url: 'https://example.com/resume-image.png',
        mimeType: 'image/png',
      });

      expect(result.source).toBe('ocr');
      expect(result.text).toBe('Text from image');
    });
  });
});
