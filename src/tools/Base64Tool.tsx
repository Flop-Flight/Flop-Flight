import { useState } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";

export const Base64Tool = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [copied, setCopied] = useState(false);

    const handleProcess = () => {
        try {
            if (mode === "encode") {
                setOutput(btoa(input));
            } else {
                setOutput(atob(input));
            }
        } catch (e) {
            setOutput("Error: Invalid input for Base64 " + mode);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center">
                <div className="flex rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200">
                    <button
                        onClick={() => setMode("encode")}
                        className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${mode === "encode" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        Encode
                    </button>
                    <button
                        onClick={() => setMode("decode")}
                        className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${mode === "decode" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        Decode
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <label className="text-sm font-medium text-slate-700">Input Text</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === "encode" ? "Enter plain text to encode..." : "Enter Base64 string to decode..."}
                        className="h-64 w-full resize-none rounded-2xl border-slate-200 bg-slate-50 p-4 font-mono text-sm shadow-inner transition-shadow focus:bg-white focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                        onClick={handleProcess}
                        className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-transform active:scale-[0.98]"
                    >
                        {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">Result</label>
                        {output && (
                            <button onClick={copyToClipboard} className="flex items-center space-x-1 text-xs font-medium text-blue-600">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                <span>Copy</span>
                            </button>
                        )}
                    </div>
                    <div className="h-64 h-full w-full overflow-auto rounded-2xl border-slate-200 bg-slate-100 p-4 font-mono text-sm text-slate-800 shadow-inner">
                        {output || <span className="text-slate-400">Result will appear here...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};
