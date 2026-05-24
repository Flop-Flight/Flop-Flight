import { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronUp, ChevronDown } from "lucide-react";

export const Metronome = () => {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContext = useRef<AudioContext | null>(null);

    const playClick = () => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const osc = audioContext.current.createOscillator();
        const envelope = audioContext.current.createGain();

        osc.frequency.setValueAtTime(880, audioContext.current.currentTime);
        envelope.gain.setValueAtTime(1, audioContext.current.currentTime);
        envelope.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.1);

        osc.connect(envelope);
        envelope.connect(audioContext.current.destination);

        osc.start();
        osc.stop(audioContext.current.currentTime + 0.1);
    };

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            const ms = 60000 / bpm;
            interval = setInterval(playClick, ms);
        }
        return () => clearInterval(interval);
    }, [isPlaying, bpm]);

    return (
        <div className="mx-auto max-w-sm space-y-10">
            <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl bg-white p-12 shadow-sm ring-1 ring-slate-200">
                <div className="text-6xl font-black text-slate-900">{bpm}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Beats Per Minute</div>
                
                <div className="mt-8 flex items-center space-x-4">
                    <button 
                      onClick={() => setBpm(prev => Math.max(prev - 5, 20))}
                      className="rounded-xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
                    >
                        <ChevronDown className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-amber-500 shadow-amber-100' : 'bg-blue-600 shadow-blue-100'}`}
                    >
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </button>
                    <button 
                      onClick={() => setBpm(prev => Math.min(prev + 5, 280))}
                      className="rounded-xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
                    >
                        <ChevronUp className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <input
              type="range"
              min="20"
              max="280"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
            />
        </div>
    );
};
