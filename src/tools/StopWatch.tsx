import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";

export const StopWatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 10);
            }, 10);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRunning]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    const handleReset = () => {
        setTime(0);
        setIsRunning(false);
        setLaps([]);
    };

    const handleLap = () => {
        setLaps(prev => [time, ...prev]);
    };

    return (
        <div className="mx-auto max-w-lg space-y-8">
            <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-900 p-12 text-blue-400 shadow-2xl">
                <TimerIcon className="mb-4 h-8 w-8 opacity-50" />
                <div className="font-mono text-6xl font-bold tracking-tighter sm:text-7xl">
                    {formatTime(time)}
                </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={handleReset}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                >
                    <RotateCcw className="h-6 w-6" />
                </button>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95 ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </button>
                <button
                    onClick={handleLap}
                    disabled={!isRunning}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
                >
                    <span className="text-sm font-bold">LAP</span>
                </button>
            </div>

            {laps.length > 0 && (
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="max-h-64 overflow-y-auto">
                        {laps.map((lap, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b border-slate-50 p-4 text-sm font-medium last:border-0 hover:bg-slate-50">
                                <span className="text-slate-400">Lap {laps.length - idx}</span>
                                <span className="font-mono text-slate-900">{formatTime(lap)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
