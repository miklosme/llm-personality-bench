import { type LanguageModel, wrapLanguageModel } from 'ai';
import type { LanguageModelV2Middleware } from '@ai-sdk/provider';
import { anthropic } from '@ai-sdk/anthropic';
// import { google } from '@ai-sdk/google';
import * as kv from './kv';
import superjson from 'superjson';
import deterministicHash from 'deterministic-object-hash';

const cacheMiddleware: LanguageModelV2Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = await deterministicHash(params);

    const value = await kv.get(cacheKey);

    if (value) {
      return superjson.parse(value);
    }

    const result = await doGenerate();

    await kv.set(cacheKey, superjson.stringify(result));

    return result;
  },
};

export interface RunnableModel {
  name: string;
  llm: LanguageModel;
}

export const modelsToRun: RunnableModel[] = wrapWithCache([
  {
    name: 'sonnet 3.7',
    llm: anthropic('claude-3-7-sonnet-20250219'),
  },
]);

export interface SystemPrompt {
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
  return runnableModels.map((model) => ({
    ...model,
    llm: wrapLanguageModel({
      model: model.llm as any,
      middleware: cacheMiddleware,
    }),
  }));
}

export interface QuestionFile {
  category: string;
  questions: Array<{ question: string }>;
}
