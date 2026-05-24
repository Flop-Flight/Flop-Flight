import { useState } from "react";
import { Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const RandomNamePicker = () => {
    const [names, setNames] = useState("");
    const [winner, setWinner] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const pickWinner = () => {
        const nameList = names.split("\n").map(n => n.trim()).filter(Boolean);
        if (nameList.length === 0) return;

        setIsSpinning(true);
        setWinner(null);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * nameList.length);
            setWinner(nameList[randomIndex]);
            setIsSpinning(false);
        }, 1500);
    };

    return (
        <div className="mx-auto max-w-xl space-y-8">
            <textarea
                value={names}
                onChange={(e) => setNames(e.target.value)}
                placeholder="Enter names here (one per line)..."
                className="h-64 w-full resize-none rounded-2xl border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-inner focus:ring-2 focus:ring-blue-600"
            />

            <button
                onClick={pickWinner}
                disabled={isSpinning || !names.trim()}
                className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
                {isSpinning ? "Picking..." : "Pick a Winner!"}
            </button>

            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex flex-col items-center justify-center rounded-3xl bg-amber-50 p-10 ring-2 ring-amber-200"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <h2 className="mt-4 text-sm font-bold uppercase tracking-widest text-amber-600">The Winner is</h2>
                        <p className="mt-2 text-5xl font-black text-slate-900">{winner}</p>
                        <button
                          onClick={() => setWinner(null)}
                          className="mt-6 flex items-center space-x-2 text-slate-400 hover:text-slate-600"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span className="text-sm font-medium">Reset</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
