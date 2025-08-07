export interface Dataset {
  category: string;
  questions: Array<{ question: string }>;
}

export const getDataset = async () =>
  [
    await Bun.file('questions/01-information-density.json').json(),
    await Bun.file('questions/02-epistemic-calibration.json').json(),
    await Bun.file('questions/03-critical-analysis.json').json(),
    // await Bun.file('questions/04-register-tone-consistency.json').json(),
    // await Bun.file('questions/05-creativity-under-constraints.json').json(),
    // await Bun.file('questions/06-straussian-reading.json').json(),
    await Bun.file('questions/07-cultural-fluency-mixing.json').json(),
    // await Bun.file('questions/08-opinion-generation-bypass.json').json(),
  ] as Dataset[];
