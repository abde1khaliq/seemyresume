import { ToolLoopAgent, Output, stepCountIs } from 'ai';
import { hackclub, model } from '../config';
import { imageAnalysisSchema } from '../prompts/schemas';
import { skills } from '../utils/skill-loader';
import { analyzeImage } from '../tools';

export const imageAnalyzerAgent = new ToolLoopAgent({
  model: hackclub(model),
  instructions: skills.imageAnalysis(),
  tools: {
    analyzeImage,
  },
  output: Output.object({
    schema: imageAnalysisSchema,
  }),
  stopWhen: stepCountIs(5),
});

export type ImageAnalyzerUIMessage = typeof imageAnalyzerAgent extends ToolLoopAgent<infer T>
  ? T
  : never;
