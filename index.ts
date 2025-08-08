import { modelsToRun, systemPromptsToRun, getAllCombinations, type RunnableModel, type SystemPrompt } from './models';
import { generateText } from 'ai';
import { limitFunction } from 'p-limit';
import * as db from './db';
import dataset from './questions.json';

async function doTask(model: RunnableModel, systemPrompt: SystemPrompt, categoryName: string, question: string) {
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
    categoryName,
    question,
    answer: result.text,
  });
}

const doTaskLimited = limitFunction(doTask, { concurrency: 5 });

const tasks = [];

for (const datasetCategory of dataset) {
  // only enable these categories for now
  if (
    !['information_density', 'epistemic_calibration', 'critical_analysis', 'cultural_fluency_mixing'].includes(
      datasetCategory.name,
    )
  ) {
    continue;
  }

  for (const question of datasetCategory.questions) {
    for (const model of modelsToRun) {
      for (const systemPrompt of systemPromptsToRun) {
        tasks.push(doTaskLimited(model, systemPrompt, datasetCategory.name, question.question));
      }
    }
  }
}

const results = await Promise.all(tasks);

console.log('DONE');
