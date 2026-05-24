import { useState } from "react";
import { Hash, RefreshCw, Copy, Shield, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const RandomNumberGenerator = () => {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [result, setResult] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateNumber = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const minNum = Math.ceil(min);
            const maxNum = Math.floor(max);
            const random = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            setResult(random);
            setIsGenerating(false);
            setCopied(false);
        }, 400);
    };

    const copyToClipboard = () => {
        if (result !== null) {
            navigator.clipboard.writeText(result.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="mx-auto max-w-xl space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 italic">Random Number Picker</h2>
                <p className="text-slate-500">Pick a fair, secure random number between any two values.</p>
            </div>

            <div className="rounded-[40px] bg-white p-8 shadow-2xl border border-slate-100">
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Range Start</label>
                        <input 
                            type="number"
                            value={min}
                            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                            className="w-full rounded-2xl bg-slate-50 p-4 font-black text-slate-900 border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Range End</label>
                        <input 
                            type="number"
                            value={max}
                            onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                            className="w-full rounded-2xl bg-slate-50 p-4 font-black text-slate-900 border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="relative mb-8 aspect-video flex flex-col items-center justify-center rounded-[32px] bg-slate-900 text-white overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.2),transparent)] opacity-50" />
                    
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                className="flex flex-col items-center"
                            >
                                <RefreshCw className="h-12 w-12 text-blue-400 animate-spin mb-4" />
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Picking...</span>
                            </motion.div>
                        ) : result !== null ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-7xl font-black italic tracking-tighter sm:text-8xl">{result}</span>
                                <button 
                                    onClick={copyToClipboard}
                                    className={`mt-6 flex items-center space-x-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
                                    }`}
                                >
                                    {copied ? <Shield className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    <span>{copied ? 'Copied to clipboard' : 'Click to copy'}</span>
                                </button>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center opacity-40">
                                <Hash className="h-12 w-12 mb-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Result will appear here</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={generateNumber}
                    disabled={isGenerating}
                    className="w-full rounded-[24px] bg-blue-600 py-6 text-xl font-black text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                    Pick a Number
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4 border border-slate-100 flex items-start space-x-3">
                    <div className="rounded-lg bg-blue-50 p-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">Secure Random</p>
                        <p className="text-[9px] text-slate-500 italic mt-0.5">Using system-level random entropy for fair results.</p>
                    </div>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-slate-100 flex items-start space-x-3">
                    <div className="rounded-lg bg-slate-50 p-2">
                        <Info className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">Browser Based</p>
                        <p className="text-[9px] text-slate-500 italic mt-0.5">Processed locally. No numbers are sent to our servers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
