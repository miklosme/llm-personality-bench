import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

type HumanevalResult = {
  id: number;
  modelName: string;
  systemPromptName: string;
  categoryName: string;
  question: string;
  answer: string;
  createdAt: string;
  scores: Record<string, number | null>;
};

type HumanevalPair = {
  category: string;
  question: string;
  results: HumanevalResult[];
};

function App() {
  const humaneval = useQuery({
    queryKey: ['humaneval'],
    queryFn: async () => {
      const res = await fetch('/api/humaneval');
      return (await res.json()) as { criteria: string[]; pairs: HumanevalPair[] };
    },
    staleTime: 30_000,
  });

  const criteria = humaneval.data?.criteria ?? [];
  const pairs = humaneval.data?.pairs ?? [];

  return (
    <div>
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse p-4 pt-0">
        eigenprompt humaneval
      </h1>
      {humaneval.isLoading ? (
        <div className="p-4 text-sm text-gray-600">loading…</div>
      ) : pairs.length === 0 ? (
        <div className="p-4 text-sm text-gray-600">no items need scoring</div>
      ) : (
        <div className="space-y-8 p-4 pt-0">
          {pairs.map((pair: HumanevalPair, idx: number) => (
            <PairBlock key={`${pair.category}::${pair.question}::${idx}`} pair={pair} criteria={criteria} />
          ))}
        </div>
      )}
    </div>
  );
}

function PairBlock({ pair, criteria }: { pair: HumanevalPair; criteria: string[] }) {
  const columnWidthClass = useMemo(() => {
    const columns = pair.results.length;
    const minWidthPx = 280;
    return {
      gridTemplateColumns: `minmax(240px, 0.8fr) repeat(${columns}, minmax(${minWidthPx}px, 1fr))`,
    } as React.CSSProperties;
  }, [pair.results.length]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b">
        <div className="text-sm text-gray-600">{pair.question}</div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid gap-0" style={columnWidthClass}>
          <div className="bg-gray-100 border-r p-2 text-xs font-semibold text-gray-700"></div>
          {pair.results.map((r) => (
            <div key={r.id} className="border-r p-3 text-xs leading-tight whitespace-pre-wrap">
              {r.answer}
            </div>
          ))}

          {criteria.map((c) => (
            <React.Fragment key={c}>
              <div className="bg-gray-50 border-t border-r p-2 text-xs font-medium text-gray-700">{c}</div>
              {pair.results.map((r) => (
                <ScoreCell key={`${r.id}:${c}`} resultId={r.id} criteria={c} value={r.scores[c] ?? null} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreCell({ resultId, criteria, value }: { resultId: number; criteria: string; value: number | null }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ score }: { score: number }) => {
      await fetch('/api/score', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, criteria, score }),
      });
    },
    onMutate: async ({ score }: { score: number }) => {
      await queryClient.cancelQueries({ queryKey: ['humaneval'] });
      const prev = queryClient.getQueryData(['humaneval']) as
        | { criteria: string[]; pairs: HumanevalPair[] }
        | undefined;
      if (prev) {
        const next = {
          ...prev,
          pairs: prev.pairs.map((p: HumanevalPair) => ({
            ...p,
            results: p.results.map((r: HumanevalResult) =>
              r.id === resultId ? { ...r, scores: { ...r.scores, [criteria]: score } } : r,
            ),
          })),
        };
        queryClient.setQueryData(['humaneval'], next);
      }
      return { prev };
    },
    onError: (
      _err: unknown,
      _vars: { score: number },
      ctx?: { prev?: { criteria: string[]; pairs: HumanevalPair[] } },
    ) => {
      if (ctx?.prev) queryClient.setQueryData(['humaneval'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['humaneval'] });
    },
  });

  return (
    <div className="border-t border-r p-2">
      <RatingRadio
        name={`r-${resultId}-${criteria}`}
        value={value}
        onChange={(val) => mutation.mutate({ score: Number(val) })}
      />
    </div>
  );
}

function RatingRadio({
  name,
  value,
  onChange,
}: {
  name: string;
  value: number | null;
  onChange: (val: number) => void | Promise<void>;
}) {
  return (
    <div className="flex items-center gap-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className="inline-flex items-center gap-1 text-xs text-gray-700 cursor-pointer select-none">
          <input
            type="radio"
            name={name}
            className="size-3 accent-indigo-600"
            checked={value === n}
            onChange={() => onChange(n)}
          />
          <span>{n}</span>
        </label>
      ))}
    </div>
  );
}
