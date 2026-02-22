import { ToolLoopAgent, Output, stepCountIs } from 'ai';
import { hackclub, MODELS } from '../config';
import { imageAnalysisSchema } from '../prompts/schemas';
import { skills } from '../utils/skill-loader';
import { analyzeImageTool } from '../tools';

export const imageAnalyzerAgent = new ToolLoopAgent({
  model: hackclub(MODELS.vision),
  instructions: skills.imageAnalysis(),
  tools: {
    analyzeImage: analyzeImageTool,
  },
  output: Output.object({
    schema: imageAnalysisSchema,
  }),
  stopWhen: stepCountIs(5),
});

export type ImageAnalyzerUIMessage = typeof imageAnalyzerAgent extends ToolLoopAgent<infer T>
  ? T
  : never;
