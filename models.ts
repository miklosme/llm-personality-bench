import { type LanguageModel } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
// import { google } from '@ai-sdk/google';

interface RunnableModel {
  name: string;
  llm: LanguageModel;
}

export const modelsToRun: RunnableModel[] = wrapWithCache([
  {
    name: 'sonnet 3.7',
    llm: anthropic('claude-3-7-sonnet-20250219'),
  },
]);

interface SystemPrompt {
  name: string;
  prompt: string;
}

export const systemPromptsToRun: SystemPrompt[] = [
  {
    name: 'eigenprompt',
    prompt: await Bun.file('prompts/eigenprompt.md').text(),
  },
  {
    name: 'traceprompt',
    prompt: await Bun.file('prompts/traceprompt.md').text(),
  },
  {
    name: 'miklosprompt',
    prompt: await Bun.file('prompts/miklosprompt.md').text(),
  },
];

function wrapWithCache(runnableModels: RunnableModel[]): RunnableModel[] {
  // TODO
}
