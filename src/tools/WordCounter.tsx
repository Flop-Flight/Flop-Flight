import { useState, useMemo } from "react";

export const WordCounter = () => {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readingTime = Math.ceil(words / 200); // Avg reading speed 200 wpm
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    
    return { chars, words, readingTime, sentences };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.chars },
          { label: "Sentences", value: stats.sentences },
          { label: "Reading Time", value: `${stats.readingTime} min` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-blue-50/50 p-4 ring-1 ring-blue-100">
             <div className="text-sm font-medium text-blue-600">{stat.label}</div>
             <div className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div>
        <textarea
           value={text}
           onChange={(e) => setText(e.target.value)}
           placeholder="Type or paste your text here to analyze..."
           className="h-64 w-full resize-none rounded-xl border-0 bg-slate-50 p-4 text-slate-900 shadow-inner ring-1 ring-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 sm:text-lg sm:leading-relaxed"
        />
      </div>
      
      <div className="flex justify-end">
         <button 
           onClick={() => setText("")}
           className="inline-flex items-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
         >
            Clear Text
         </button>
      </div>
    </div>
  );
};
