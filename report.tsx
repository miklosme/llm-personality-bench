import React from 'react';
import ReactDOM from 'react-dom/client';
import { getAllResults, type Result } from './db' with { type: 'macro' };
import { getDataset, type Dataset } from './questions' with { type: 'macro' };
import { BenchGrid } from '@/components/bench-grid';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


function App() {
  const results = getAllResults() as any as Result[];
  const dataset = getDataset() as any as Dataset[];

  return (
    <div>
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse p-4 pt-0">
        eigenprompt bench
      </h1>
      {dataset.map((category) => {
        const resultsInCategory = results.filter((result) => result.category === category.category);
        return (
          <BenchGrid key={category.category} title={category.category} results={resultsInCategory} />
        );
      })}
    </div>
  );
}

