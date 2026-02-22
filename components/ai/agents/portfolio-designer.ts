import { ToolLoopAgent, Output, stepCountIs } from 'ai';
import { hackclub, model } from '../config';
import { portfolioConfigSchema } from '../prompts/schemas';
import { skills } from '../utils/skill-loader';
import { generateSection, assemblePortfolio } from '../tools';

const instructions = `
${skills.frontendDesign()}

---

${skills.portfolioAssembly()}
`;

export const portfolioDesignerAgent = new ToolLoopAgent({
  model: hackclub(model),
  instructions,
  tools: {
    generateSection,
    assemblePortfolio,
  },
  output: Output.object({
    schema: portfolioConfigSchema,
  }),
  stopWhen: stepCountIs(10),
});

export type PortfolioDesignerUIMessage = typeof portfolioDesignerAgent extends ToolLoopAgent<infer T>
  ? T
  : never;
