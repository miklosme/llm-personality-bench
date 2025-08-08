import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Result } from '@/db';
import { Info } from 'lucide-react';

export function BenchGrid({
  title,
  description,
  questions,
  allCombinations,
  results,
}: {
  title: string;
  description: string;
  questions: Array<{
    question: string;
  }>;
  allCombinations: Array<{
    modelName: string;
    systemPromptName: string;
  }>;
  results: Result[];
}) {
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
        <div className="p-1 overflow-x-auto">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `60px repeat(${allCombinations.length}, minmax(200px, 1fr))`,
            }}
          >
            {/* Header Row */}
            <div className=""></div> {/* Empty corner */}
            {allCombinations.map((combination, index) => (
              <div key={index} className="flex flex-col items-center py-2">
                <Badge variant="secondary">{combination.systemPromptName}</Badge>
                <div className="text-xs text-gray-500 whitespace-nowrap">{combination.modelName}</div>
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
                    <p>{question.question}</p>
                  </TooltipContent>
                </Tooltip>

                {allCombinations.map((combination, index) => {
                  const result = results.find(
                    (r) =>
                      r.modelName === combination.modelName &&
                      r.systemPromptName === combination.systemPromptName &&
                      r.question === question.question,
                  );
                  return (
                    <div
                      key={index}
                      className="h-24 border border-gray-200 p-2 text-xs leading-tight overflow-hidden cursor-pointer transition-all duration-200"
                    >
                      {result ? (
                        <div className="text-gray-700">{result.answer}</div>
                      ) : (
                        <div className="text-gray-500">No response</div>
                      )}
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
