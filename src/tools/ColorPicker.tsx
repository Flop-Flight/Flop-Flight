import { useState } from "react";
import { Copy, Check } from "lucide-react";

export const ColorPicker = () => {
  const [color, setColor] = useState("#3b82f6");
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-xl space-y-10">
      <div className="flex flex-col items-center space-y-6 rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <div
          className="h-40 w-40 rounded-full shadow-2xl ring-4 ring-white"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-20 cursor-pointer appearance-none bg-transparent"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { label: "HEX", value: color.toUpperCase() },
          { label: "RGB", value: hexToRgb(color) },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => copyToClipboard(item.value)}
            className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</span>
            <div className="mt-2 flex w-full items-center justify-between">
              <span className="font-mono text-xl font-bold text-slate-900">{item.value}</span>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
