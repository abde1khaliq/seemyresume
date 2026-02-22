import { ToolLoopAgent, Output, stepCountIs, InferAgentUIMessage } from 'ai';
import { hackclub, model } from './config';
import { portfolioConfigSchema } from './prompts/schemas';
import { skills, loadPrompt } from './utils/skill-loader';
import { processDocumentTool, analyzeImageTool, generateSection, assemblePortfolio } from './tools';

const mainPrompt = loadPrompt();

const instructions = `
${mainPrompt}

---

## Design Skills

${skills.frontendDesign()}

---

## Document Processing Skills

${skills.documentProcessing()}

---

## Assembly Skills

${skills.portfolioAssembly()}

---

## Workflow

1. **Process Documents**: 
   - If PDF/Image provided → use \`processDocument\` tool
   - Smart detection: native for digital PDFs, OCR for scanned
   - Returns extracted text content

2. **Analyze Images**: 
   - Use \`analyzeImage\` for each image
   - Uses gemini-3-flash for vision analysis
   - Returns: type, description, suggestedPlacement, altText

3. **Generate Sections**: 
   - Use \`generateSection\` for each section (hero, experience, projects, skills, about, contact)
   - Uses minimax-m2.5 for code generation

4. **Assemble Portfolio**: 
   - Use \`assemblePortfolio\` to combine everything
   - Validates and orders sections

Always follow this workflow. Start by processing documents, then analyze images, then generate sections in order, and finally assemble the complete portfolio.
`;

export const portfolioAgent = new ToolLoopAgent({
  model: hackclub(model),
  instructions,
  tools: {
    processDocument: processDocumentTool,
    analyzeImage: analyzeImageTool,
    generateSection,
    assemblePortfolio,
  },
  output: Output.object({
    schema: portfolioConfigSchema,
  }),
  stopWhen: stepCountIs(15),
});

export type PortfolioAgentUIMessage = InferAgentUIMessage<typeof portfolioAgent>;
