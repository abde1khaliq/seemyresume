import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/ai/config', () => ({
  hackclub: vi.fn(() => 'mocked-model'),
  model: 'mocked-model',
  MODELS: { coding: 'mocked-model', vision: 'mocked-vision-model' },
  HACKCLUB_BASE_URL: 'https://test.com',
  getApiKey: () => 'test-key',
}));

vi.mock('@/components/ai/utils/hackclub-api', () => ({
  processDocument: vi.fn(),
  analyzeImageWithVision: vi.fn(),
}));

describe('Tools', () => {
  describe('processDocumentTool', () => {
    it('should be defined', async () => {
      const { processDocumentTool } = await import('../components/ai/tools');
      expect(processDocumentTool).toBeDefined();
      expect(processDocumentTool.description).toContain('Process documents');
    });
  });

  describe('analyzeImageTool', () => {
    it('should be defined', async () => {
      const { analyzeImageTool } = await import('../components/ai/tools');
      expect(analyzeImageTool).toBeDefined();
      expect(analyzeImageTool.description).toContain('Analyze images');
    });
  });

  describe('generateSection', () => {
    it('should be defined', async () => {
      const { generateSection } = await import('../components/ai/tools');
      expect(generateSection).toBeDefined();
      expect(generateSection.description).toContain('Generate configuration');
    });
  });

  describe('assemblePortfolio', () => {
    it('should be defined', async () => {
      const { assemblePortfolio } = await import('../components/ai/tools');
      expect(assemblePortfolio).toBeDefined();
      expect(assemblePortfolio.description).toContain('Combine all sections');
    });
  });

  describe('allTools', () => {
    it('should export all tools', async () => {
      const { allTools } = await import('../components/ai/tools');
      expect(allTools).toHaveProperty('processDocument');
      expect(allTools).toHaveProperty('analyzeImage');
      expect(allTools).toHaveProperty('generateSection');
      expect(allTools).toHaveProperty('assemblePortfolio');
    });
  });
});
