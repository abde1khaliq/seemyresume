export {
  generatePortfolio,
  extractHtml,
  validateHtml,
  type GenerationInput,
  type GenerationResult,
  type ResumeData,
} from './agent';

export {
  processDocumentTool,
  analyzeImageTool,
  allTools,
} from './tools';

export {
  resumeDataSchema,
  imageAnalysisSchema,
  designSpecSchema,
  portfolioConfigSchema,
  documentInputSchema,
  imageInputSchema,
  type ResumeData as ResumeDataType,
  type ImageAnalysis,
  type ImageAnalysisItem,
  type PortfolioConfig,
  type Section,
  type HeroSection,
  type ThemeConfig,
  type SEO,
  type DocumentInput,
  type ImageInput,
  type DesignSpec as DesignSpecType,
} from './prompts/schemas';

export { hackclub, model, MODELS, HACKCLUB_BASE_URL } from './config';
