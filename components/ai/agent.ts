import { ToolLoopAgent, Output, stepCountIs, InferAgentUIMessage } from 'ai';
import { hackclub, model } from './config';
import { portfolioConfigSchema } from './prompts/schemas';
import { skills, loadPrompt } from './utils/skill-loader';
import { parseResumeText, analyzeImage, generateSection, assemblePortfolio } from './tools';

const mainPrompt = loadPrompt();

const instructions = `
${mainPrompt}

---

## Design Skills

${skills.frontendDesign()}

---

## Assembly Skills

${skills.portfolioAssembly()}

---

## Workflow

1. **Parse Resume**: Use the \`parseResumeText\` tool to extract structured data from the resume
2. **Analyze Images**: Use the \`analyzeImage\` tool for each provided image
3. **Generate Sections**: Use \`generateSection\` for each portfolio section (hero, experience, projects, skills, about, contact)
4. **Assemble Portfolio**: Use \`assemblePortfolio\` to combine everything into the final configuration

Always follow this workflow. Start by parsing the resume, then analyze images, then generate sections in order, and finally assemble the complete portfolio.
`;

export const portfolioAgent = new ToolLoopAgent({
  model: hackclub(model),
  instructions,
  tools: {
    parseResumeText,
    analyzeImage,
    generateSection,
    assemblePortfolio,
  },
  output: Output.object({
    schema: portfolioConfigSchema,
  }),
  stopWhen: stepCountIs(15),
});

export type PortfolioAgentUIMessage = InferAgentUIMessage<typeof portfolioAgent>;
