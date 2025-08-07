import { modelsToRun, systemPromptsToRun, type RunnableModel, type SystemPrompt, type QuestionFile } from './models';
import { generateText } from 'ai';
import { limitFunction } from 'p-limit';
import * as db from './db';

const questionsFiles = [
  await Bun.file('questions/01-information-density.json').json(),
  await Bun.file('questions/02-epistemic-calibration.json').json(),
  await Bun.file('questions/03-critical-analysis.json').json(),
  // await Bun.file('questions/04-register-tone-consistency.json').json(),
  // await Bun.file('questions/05-creativity-under-constraints.json').json(),
  // await Bun.file('questions/06-straussian-reading.json').json(),
  await Bun.file('questions/07-cultural-fluency-mixing.json').json(),
  // await Bun.file('questions/08-opinion-generation-bypass.json').json(),
] as QuestionFile[];

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

for (const questionFile of questionsFiles) {
  for (const question of questionFile.questions) {
    for (const model of modelsToRun) {
      for (const systemPrompt of systemPromptsToRun) {
        tasks.push(doTaskLimited(model, systemPrompt, questionFile.category, question.question));
      }
    }
  }
}

const results = await Promise.all(tasks);

console.log('DONE');
