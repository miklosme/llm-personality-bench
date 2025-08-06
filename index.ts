import { modelsToRun, systemPromptsToRun, type RunnableModel, type SystemPrompt, type QuestionFile } from './models';
import { generateText } from 'ai';
import { limitFunction } from 'p-limit';
import { db } from './persistence';

const questionsFiles = [
  await Bun.file('questions/possibly_controversial.json').json(),
  // await Bun.file('questions/intellectual_contribution.json').json(),
  // await Bun.file('questions/glazing.json').json(),
  // await Bun.file('questions/conforming_user_opinion.json').json(),
] as QuestionFile[];

async function doTask(model: RunnableModel, systemPrompt: SystemPrompt, category: string, question: string) {
  console.log(`[${model.name}][${systemPrompt.name}] ${question}`);

  const result = await generateText({
    model: model.llm,
    system: systemPrompt.prompt,
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
