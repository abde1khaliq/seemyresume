import { ToolLoopAgent, Output, stepCountIs } from 'ai';
import { hackclub, model } from '../config';
import { resumeDataSchema } from '../prompts/schemas';
import { skills } from '../utils/skill-loader';

export const resumeParserAgent = new ToolLoopAgent({
  model: hackclub(model),
  instructions: skills.resumeParsing(),
  output: Output.object({
    schema: resumeDataSchema,
  }),
  stopWhen: stepCountIs(3),
});

export type ResumeParserUIMessage = typeof resumeParserAgent extends ToolLoopAgent<infer T>
  ? T
  : never;
