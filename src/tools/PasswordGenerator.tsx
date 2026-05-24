import { useState, useCallback } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";

export const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      setPassword("Select at least one option");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  }, [length, options]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useState(() => {
    generatePassword();
  });

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="relative">
        <div className="flex h-16 w-full items-center justify-between rounded-xl bg-slate-100 px-4 font-mono text-xl text-slate-900 shadow-inner ring-1 ring-slate-200">
          <span className="truncate">{password}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={generatePassword}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={copyToClipboard}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
            >
              {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div>
          <div className="flex justify-between text-sm font-medium text-slate-700">
            <span>Password Length</span>
            <span className="text-blue-600">{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="50"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="flex cursor-pointer items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100">
              <input
                type="checkbox"
                checked={value}
                onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof options] }))}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm font-medium capitalize text-slate-700">{key}</span>
            </label>
          ))}
        </div>

        <button
          onClick={generatePassword}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition-transform hover:scale-[0.98] active:scale-[0.95]"
        >
          Generate New Password
        </button>
      </div>
    </div>
  );
};
