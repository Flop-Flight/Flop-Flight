import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

export const CaptionGenerator = () => {
    const [topic, setTopic] = useState("");
    const [mood, setMood] = useState("Professional");
    const [result, setResult] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const generate = () => {
        setIsGenerating(true);
        // Simple logic for MVP, in real app this could use Gemini
        setTimeout(() => {
            const templates = [
                `Elevating ${topic} to the next level. #${topic.replace(/\s/g, '')} #vibe`,
                `Living my best life with ${topic}. ✨`,
                `${mood} vibes only today. 🚀`,
                `Throwback to ${topic}. Those were the days!`,
                `Just ${topic} things. Thoughts? 👇`
            ];
            setResult(templates);
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div>
                    <label className="text-sm font-medium text-slate-700">What is your post about?</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Hiking, Coding, New Car"
                        className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {["Funny", "Professional", "Deep", "Minimalist"].map(m => (
                        <button
                          key={m}
                          onClick={() => setMood(m)}
                          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${mood === m ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                        >
                          {m}
                        </button>
                    ))}
                </div>

                <button
                    onClick={generate}
                    disabled={!topic || isGenerating}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                    <Sparkles className="h-5 w-5" />
                    <span>{isGenerating ? "Synthesizing..." : "Generate Captions"}</span>
                </button>
            </div>

            {result.length > 0 && (
                <div className="space-y-3">
                    {result.map((cap, i) => (
                        <div key={i} className="group relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200">
                            <p className="text-sm font-medium text-slate-700 pr-10">{cap}</p>
                            <button 
                              onClick={() => navigator.clipboard.writeText(cap)}
                              className="absolute right-4 top-4 text-slate-300 hover:text-blue-600"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
