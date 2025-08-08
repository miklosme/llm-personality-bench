import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Result } from '@/db';
import { Info } from 'lucide-react';

export function BenchGrid({ title, description, results }: { title: string; description: string; results: Result[] }) {
  // extract unique questions and system prompts
  const questions = [...new Set(results.map((r) => r.question))];
  const systemPrompts = [...new Set(results.map((r) => r.systemPromptName))];

  // create lookup for quick access to answers
  const answerLookup = results.reduce((acc, result) => {
    const key = `${result.question}|${result.systemPromptName}`;
    acc[key] = result.answer;
    return acc;
  }, {} as Record<string, string>);

  return (
    <TooltipProvider>
      <div className="bg-white pb-2 border-b border-gray-200">
        {/* Category Header */}
        <div className="bg-gray-100 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-gray-400 cursor-help">
                    <Info className="h-4 w-4" aria-hidden="true" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm">
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {/* <Badge variant="secondary">{questions.length} questions</Badge> */}
          </div>
        </div>

        {/* Grid Container */}
        <div className="p-2 overflow-x-auto">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `60px repeat(${systemPrompts.length}, minmax(200px, 1fr))`,
            }}
          >
            {/* Header Row */}
            <div className=""></div> {/* Empty corner */}
            {systemPrompts.map((prompt) => (
              <div key={prompt} className="flex items-end justify-center pt-2">
                <div
                  className="text-sm font-medium text-gray-700 whitespace-nowrap"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  {prompt}
                </div>
              </div>
            ))}
            {/* Question Rows */}
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="contents">
                {/* Question Number Cell */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-24 bg-gray-50 border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-help">
                      Q{questionIndex + 1}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{question}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Answer Cells */}
                {systemPrompts.map((prompt) => {
                  const answer = answerLookup[`${question}|${prompt}`] || 'No response';
                  return (
                    <div
                      key={prompt}
                      className="h-24 border border-gray-200 p-2 text-xs leading-tight overflow-hidden cursor-pointer transition-all duration-200"
                    >
                      <div className="text-gray-700">{answer}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
