import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Focus } from "lucide-react";

export const PomodoroTimer = () => {
    const [seconds, setSeconds] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"work" | "break">("work");
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        if (isActive && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            // Notification or Alert could go here
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleReset = () => {
        setIsActive(false);
        setSeconds(mode === "work" ? 25 * 60 : 5 * 60);
    };

    const toggleMode = (newMode: "work" | "break") => {
        setMode(newMode);
        setIsActive(false);
        setSeconds(newMode === "work" ? 25 * 60 : 5 * 60);
    };

    return (
        <div className="mx-auto max-w-lg space-y-10">
            <div className="flex justify-center space-x-2">
                <button
                    onClick={() => toggleMode("work")}
                    className={`flex items-center space-x-2 rounded-xl px-6 py-2 text-sm font-semibold transition-all ${mode === "work" ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    <Focus className="h-4 w-4" />
                    <span>Focus</span>
                </button>
                <button
                    onClick={() => toggleMode("break")}
                    className={`flex items-center space-x-2 rounded-xl px-6 py-2 text-sm font-semibold transition-all ${mode === "break" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    <Coffee className="h-4 w-4" />
                    <span>Break</span>
                </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-8 rounded-[40px] bg-white p-12 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
                <div className={`font-mono text-8xl font-bold tracking-tighter ${mode === "work" ? "text-red-600" : "text-emerald-600"}`}>
                    {formatTime(seconds)}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={handleReset}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                    >
                        <RotateCcw className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`flex h-16 w-32 items-center justify-center rounded-2xl text-white shadow-xl transition-all active:scale-95 ${mode === "work" ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                    >
                        {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                </div>
            </div>
            
            <p className="text-center text-sm text-slate-500">
                {mode === "work" ? "Stay focused for 25 minutes!" : "Take a well-deserved break."}
            </p>
        </div>
    );
};
