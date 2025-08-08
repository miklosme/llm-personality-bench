import React from 'react';
import ReactDOM from 'react-dom/client';
import { getAllResults, type Result } from './db' with { type: 'macro' };
import { getAllCombinations, type Combination } from './models' with { type: 'macro' };
import { BenchGrid } from '@/components/bench-grid';
import dataset from './questions.json';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const allCombinations = getAllCombinations() as any as Combination[];

function App() {
  const results = getAllResults() as any as Result[];

  return (
    <div>
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse p-4 pt-0">
        eigenprompt bench
      </h1>
      {dataset.map((category) => {
        const resultsInCategory = results.filter((result) => result.categoryName === category.name);
        return (
          <BenchGrid
            key={category.name}
            title={category.title}
            description={category.description}
            questions={category.questions}
            allCombinations={allCombinations}
            results={resultsInCategory}
          />
        );
      })}
    </div>
  );
}
