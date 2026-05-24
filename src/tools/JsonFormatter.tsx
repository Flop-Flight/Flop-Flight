import { useState } from "react";
import { Copy, Check, FileCode } from "lucide-react";

export const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your raw JSON here... e.g. {"key": "value"}'
            className="h-96 w-full resize-none rounded-xl border-slate-200 bg-slate-50 p-4 font-mono text-sm shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Formatted Output</label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:underline"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied!" : "Copy Output"}</span>
              </button>
            )}
          </div>
          <div className="relative h-96 w-full overflow-auto rounded-xl border-slate-200 bg-slate-900 p-4 font-mono text-sm text-blue-300">
             {error ? (
               <div className="text-red-400">Error: {error}</div>
             ) : output ? (
               <pre>{output}</pre>
             ) : (
               <div className="flex h-full items-center justify-center text-slate-600">
                 Formatted JSON will appear here
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Make sure your JSON keys and values use double quotes.
        </div>
        <button
          onClick={formatJson}
          className="flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition-transform hover:scale-[0.98]"
        >
          <FileCode className="h-4 w-4" />
          <span>Format JSON</span>
        </button>
      </div>
    </div>
  );
};
