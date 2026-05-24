import { useState, useEffect, useRef } from "react";

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Programming is the art of algorithm design and the craft of debugging code. Success is not final, failure is not fatal: it is the courage to continue that counts.";

export const TypingTest = () => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [userInput, setUserInput] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        if (isStarted && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(intervalRef.current);
            setIsFinished(true);
            const words = userInput.trim().split(/\s+/).length;
            setWpm(words);
        }
        return () => clearInterval(intervalRef.current);
    }, [isStarted, timeLeft, userInput]);

    const handleStart = () => {
        setIsStarted(true);
        setIsFinished(false);
        setTimeLeft(60);
        setUserInput("");
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="flex justify-between rounded-2xl bg-slate-900 p-6 text-white">
                <div className="text-center">
                    <p className="text-xs uppercase tracking-widest opacity-50 font-bold">Time</p>
                    <p className="text-2xl font-black text-blue-400">{timeLeft}s</p>
                </div>
                {isFinished && (
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-widest opacity-50 font-bold">WPM</p>
                        <p className="text-2xl font-black text-emerald-400">{wpm}</p>
                    </div>
                )}
                <div className="text-center">
                    <p className="text-xs uppercase tracking-widest opacity-50 font-bold">Progress</p>
                    <p className="text-2xl font-black text-slate-300">{userInput.length} chars</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <p className="text-xl leading-relaxed text-slate-400 select-none">
                    {SAMPLE_TEXT.split("").map((char, i) => {
                        let color = "text-slate-400";
                        if (i < userInput.length) {
                            color = char === userInput[i] ? "text-slate-900 font-medium" : "text-red-500 bg-red-50";
                        }
                        return <span key={i} className={color}>{char}</span>;
                    })}
                </p>
            </div>

            {!isStarted || isFinished ? (
               <button
                 onClick={handleStart}
                 className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg active:scale-[0.98]"
               >
                 {isFinished ? "Try Again" : "Start Typing Test"}
               </button>
            ) : (
                <textarea
                    autoFocus
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="h-32 w-full resize-none rounded-2xl border-slate-200 bg-slate-50 p-4 font-mono shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-600"
                    placeholder="Start typing the text above..."
                />
            )}
        </div>
    );
};
