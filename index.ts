import { modelsToRun, systemPromptsToRun, type RunnableModel, type SystemPrompt } from './models';
import { generateText } from 'ai';
import { limitFunction } from 'p-limit';
import * as db from './db';
import { getDataset } from './questions' with { type: 'macro' };

const dataset = await getDataset();

async function doTask(model: RunnableModel, systemPrompt: SystemPrompt, category: string, question: string) {
  console.log(`[${model.name}][${systemPrompt.name}] ${question}`);

  const result = await generateText({
    model: model.llm,
    // we're testing the default system prompt with an empty string
    system: systemPrompt.prompt ? systemPrompt.prompt : undefined,
    messages: [{ role: 'user', content: question }],
  });

  await db.saveResult({
    modelName: model.name,
    systemPromptName: systemPrompt.name,
    category,
    question,
    answer: result.text,
  });
}

const doTaskLimited = limitFunction(doTask, { concurrency: 5 });

const tasks = [];

for (const datasetCategory of dataset) {
  for (const question of datasetCategory.questions) {
    for (const model of modelsToRun) {
      for (const systemPrompt of systemPromptsToRun) {
        tasks.push(doTaskLimited(model, systemPrompt, datasetCategory.category, question.question));
      }
    }
  }
}

const results = await Promise.all(tasks);

console.log('DONE');
