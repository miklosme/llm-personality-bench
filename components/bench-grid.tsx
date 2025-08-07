import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Result } from '@/db';

export function BenchGrid({ title, results }: { title: string; results: Result[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {results.map((result) => (
        <div key={result.question}>
          <Badge>{result.modelName}</Badge>
          <p>{result.answer}</p>
        </div>
      ))}
    </div>
  );
  // const [hoveredCell, setHoveredCell] = useState<{ category: string; question: number; prompt: string } | null>(null);

  // return (
  //   <TooltipProvider>
  //     <div className="space-y-8">
  //       {benchmarkData.categories.map((category, categoryIndex) => (
  //         <div key={category.name} className="bg-white rounded-lg shadow-sm border">
  //           {/* Category Header */}
  //           <div className="bg-gray-100 px-6 py-4 border-b">
  //             <div className="flex items-center justify-between">
  //               <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
  //               <Badge variant="secondary">{category.questions.length} questions</Badge>
  //             </div>
  //           </div>

  //           {/* Grid Container */}
  //           <div className="p-4 overflow-x-auto">
  //             <div
  //               className="grid gap-1"
  //               style={{
  //                 gridTemplateColumns: `60px repeat(${benchmarkData.systemPrompts.length}, minmax(200px, 1fr))`,
  //               }}
  //             >
  //               {/* Header Row */}
  //               <div className="h-20"></div> {/* Empty corner */}
  //               {benchmarkData.systemPrompts.map((prompt) => (
  //                 <div key={prompt} className="h-20 flex items-end justify-center pb-2">
  //                   <div
  //                     className="transform -rotate-45 origin-bottom text-sm font-medium text-gray-700 whitespace-nowrap"
  //                     style={{ transformOrigin: 'bottom center' }}
  //                   >
  //                     {prompt}
  //                   </div>
  //                 </div>
  //               ))}
  //               {/* Question Rows */}
  //               {category.questions.map((question, questionIndex) => (
  //                 <div key={questionIndex} className="contents">
  //                   {/* Question Number Cell */}
  //                   <Tooltip>
  //                     <TooltipTrigger asChild>
  //                       <div className="h-24 bg-gray-50 border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-help">
  //                         Q{questionIndex + 1}
  //                       </div>
  //                     </TooltipTrigger>
  //                     <TooltipContent side="right" className="max-w-xs">
  //                       <p>{question}</p>
  //                     </TooltipContent>
  //                   </Tooltip>

  //                   {/* Answer Cells */}
  //                   {benchmarkData.systemPrompts.map((prompt) => {
  //                     const response =
  //                       benchmarkData.responses[category.name]?.[questionIndex]?.[prompt] || 'No response';
  //                     const isHovered =
  //                       hoveredCell?.category === category.name &&
  //                       hoveredCell?.question === questionIndex &&
  //                       hoveredCell?.prompt === prompt;

  //                     return (
  //                       <div
  //                         key={prompt}
  //                         className={`h-24 border border-gray-200 p-2 text-xs leading-tight overflow-hidden cursor-pointer transition-all duration-200 ${
  //                           isHovered
  //                             ? 'bg-blue-50 border-blue-300 shadow-md z-10 transform scale-105'
  //                             : 'bg-white hover:bg-gray-50'
  //                         }`}
  //                         onMouseEnter={() =>
  //                           setHoveredCell({ category: category.name, question: questionIndex, prompt })
  //                         }
  //                         onMouseLeave={() => setHoveredCell(null)}
  //                       >
  //                         <div className={`${isHovered ? 'line-clamp-none' : 'line-clamp-4'} text-gray-700`}>
  //                           {response}
  //                         </div>
  //                       </div>
  //                     );
  //                   })}
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </TooltipProvider>
  // );
}
