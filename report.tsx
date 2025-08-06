import React from 'react';
import ReactDOM from 'react-dom/client';
import { db } from './persistence';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const results = await db.getAllResults();

function App() {
  return (
    <div>
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
        hello, world!
      </h1>
      <code className="text-sm text-gray-500 whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</code>
    </div>
  );
}
