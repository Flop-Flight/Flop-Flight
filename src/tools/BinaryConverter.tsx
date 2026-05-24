import { useState } from "react";

export const BinaryConverter = () => {
    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"text-to-binary" | "binary-to-text">("text-to-binary");
    const [output, setOutput] = useState("");

    const process = () => {
        try {
            if (mode === "text-to-binary") {
                setOutput(input.split("").map(char => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" "));
            } else {
                setOutput(input.split(" ").map(bin => String.fromCharCode(parseInt(bin, 2))).join(""));
            }
        } catch (e) {
            setOutput("Invalid input");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center space-x-2">
                <button
                    onClick={() => setMode("text-to-binary")}
                    className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${mode === "text-to-binary" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    Text to Binary
                </button>
                <button
                    onClick={() => setMode("binary-to-text")}
                    className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${mode === "binary-to-text" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    Binary to Text
                </button>
            </div>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "text-to-binary" ? "Enter text here..." : "Enter binary code (space separated)..."}
                className="h-48 w-full resize-none rounded-2xl border-slate-200 bg-slate-50 p-4 font-mono shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-600"
            />

            <button
                onClick={process}
                className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg active:scale-[0.98]"
            >
                Convert
            </button>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Result</p>
                <div className="mt-2 h-48 overflow-auto font-mono text-slate-700">
                    {output || "Result will appear here..."}
                </div>
            </div>
        </div>
    );
};
