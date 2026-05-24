import { useState } from "react";
import { Copy, Check, Type } from "lucide-react";

export const CaseConverter = () => {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const convert = (type: "upper" | "lower" | "title" | "sentence") => {
        let result = text;
        switch (type) {
            case "upper": result = text.toUpperCase(); break;
            case "lower": result = text.toLowerCase(); break;
            case "title": 
                result = text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '); 
                break;
            case "sentence":
                result = text.toLowerCase().split('. ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join('. ');
                break;
        }
        setText(result);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here..."
                className="h-64 w-full resize-none rounded-2xl border-slate-200 bg-slate-50 p-6 text-lg text-slate-900 shadow-inner transition-shadow focus:bg-white focus:ring-2 focus:ring-blue-600"
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <button 
                  onClick={() => convert("upper")}
                  className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  UPPERCASE
                </button>
                <button 
                  onClick={() => convert("lower")}
                  className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  lowercase
                </button>
                <button 
                  onClick={() => convert("title")}
                  className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Title Case
                </button>
                <button 
                  onClick={() => convert("sentence")}
                  className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sentence Case
                </button>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={() => setText("")}
                    className="text-sm font-medium text-slate-400 hover:text-slate-600"
                >
                    Clear Text
                </button>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-transform active:scale-[0.98]"
                >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    <span>Copy Result</span>
                </button>
            </div>
        </div>
    );
};
