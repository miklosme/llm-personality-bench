import { modelsToRun, systemPromptsToRun } from './models';
import { generateText } from 'ai';

const questions = await Bun.file('questions/possibly_controversial.json').json();

const question = questions[0];

const result = await generateText({
  model: modelsToRun[0]!.llm,
  system: systemPromptsToRun[0]!.prompt,
  messages: [{ role: 'user', content: question.question }],
});

console.log('Q:');
console.log(question.question);

console.log('A:');
console.log(result.text);
