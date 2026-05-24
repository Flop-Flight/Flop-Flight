import { useState } from "react";
import { Play, Fullscreen, Code } from "lucide-react";

export const HtmlPreview = () => {
    const [html, setHtml] = useState("<h1>Hello Luminix!</h1>\n<p>Try editing this code.</p>\n<button style='padding: 10px; background: blue; color: white;'>Click Me</button>");
    
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">HTML Code</label>
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-600">
                        <Code className="h-3 w-3" />
                        <span>Live Edit</span>
                    </div>
                </div>
                <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="h-96 w-full resize-none rounded-2xl border-slate-200 bg-slate-900 p-6 font-mono text-sm text-blue-300 shadow-inner focus:ring-2 focus:ring-blue-600"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">Live Preview</label>
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600">
                        <Play className="h-3 w-3" />
                        <span>Rendering</span>
                    </div>
                </div>
                <div className="h-96 w-full overflow-auto rounded-2xl bg-white p-6 shadow-inner ring-1 ring-slate-200">
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </div>
        </div>
    );
};
