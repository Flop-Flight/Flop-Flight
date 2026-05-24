import { useState, useEffect } from "react";
import { Activity, Wind, RotateCcw, Play, Calculator, Timer, Zap, Magnet } from "lucide-react";
import { motion } from "motion/react";

export const PhysicsLab = () => {
    const [initialVelocity, setInitialVelocity] = useState(0);
    const [acceleration, setAcceleration] = useState(9.8);
    const [time, setTime] = useState(2);
    const [displacement, setDisplacement] = useState(0);
    const [finalVelocity, setFinalVelocity] = useState(0);

    const calculate = () => {
        const v0 = parseFloat(initialVelocity.toString());
        const a = parseFloat(acceleration.toString());
        const t = parseFloat(time.toString());

        // d = v0t + 0.5at^2
        const d = (v0 * t) + (0.5 * a * t * t);
        // v = v0 + at
        const v = v0 + (a * t);

        setDisplacement(d);
        setFinalVelocity(v);
    };

    useEffect(() => {
        calculate();
    }, [initialVelocity, acceleration, time]);

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 italic uppercase">Kinematics Lab</h2>
                <p className="text-slate-500 italic">Simulate motion and calculate displacement, velocity, and force.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls Area */}
                <div className="rounded-[40px] bg-white p-8 shadow-2xl border border-slate-100 flex flex-col justify-between">
                    <div className="space-y-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-black italic tracking-tight text-slate-900 uppercase underline decoration-blue-500/20 underline-offset-4">Lab Parameters</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                                    <span className="text-slate-400">Initial Velocity (v₀)</span>
                                    <span className="text-blue-600">{initialVelocity} m/s</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" step="1"
                                    value={initialVelocity}
                                    onChange={(e) => setInitialVelocity(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                                    <span className="text-slate-400">Acceleration (a)</span>
                                    <span className="text-indigo-600">{acceleration} m/s²</span>
                                </div>
                                <input 
                                    type="range" min="-20" max="20" step="0.1"
                                    value={acceleration}
                                    onChange={(e) => setAcceleration(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => setAcceleration(9.8)} className="text-[8px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-500 uppercase font-bold tracking-widest">Earth (g)</button>
                                    <button onClick={() => setAcceleration(1.6)} className="text-[8px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-500 uppercase font-bold tracking-widest">Moon</button>
                                    <button onClick={() => setAcceleration(0)} className="text-[8px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-500 uppercase font-bold tracking-widest">Vacuum</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                                    <span className="text-slate-400">Time (t)</span>
                                    <span className="text-emerald-600">{time} seconds</span>
                                </div>
                                <input 
                                    type="range" min="0.1" max="60" step="0.1"
                                    value={time}
                                    onChange={(e) => setTime(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setInitialVelocity(0); setAcceleration(9.8); setTime(2); }}
                        className="mt-8 flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Experiment</span>
                    </button>
                </div>

                {/* Output Area */}
                <div className="rounded-[40px] bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="h-32 w-32 animate-pulse" />
                    </div>

                    <div className="relative z-10 space-y-12">
                        <div className="text-center group">
                            <motion.div
                                key={displacement}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-2"
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 italic">Total Displacement (d)</p>
                                <h3 className="text-7xl font-black italic tracking-tighter">
                                    {displacement.toFixed(2)}
                                    <span className="text-2xl not-italic ml-2 text-slate-500">M</span>
                                </h3>
                                <div className="h-1 w-24 bg-blue-500/30 mx-auto rounded-full overflow-hidden">
                                     <motion.div 
                                        animate={{ x: ["-100%", "100%"] }} 
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="h-full w-full bg-blue-400" 
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 text-center">
                                <div className="flex items-center justify-center space-x-2 text-indigo-400 mb-2">
                                    <Wind className="h-4 w-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Final Velocity</span>
                                </div>
                                <p className="text-2xl font-black italic tracking-tight">{finalVelocity.toFixed(1)} <span className="text-[10px] font-bold text-slate-500 italic">m/s</span></p>
                            </div>
                            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 text-center">
                                <div className="flex items-center justify-center space-x-2 text-emerald-400 mb-2">
                                    <Timer className="h-4 w-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Observation</span>
                                </div>
                                <p className="text-2xl font-black italic tracking-tight">{time} <span className="text-[10px] font-bold text-slate-500 italic">SEC</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 mt-8 border-t border-white/10 italic text-[10px] text-slate-500 text-center">
                        Simulating kinematic equations under uniform acceleration.
                        <div className="mt-2 text-blue-400/60 font-black uppercase tracking-[0.2em]">d = v₀t + ½at²</div>
                    </div>
                </div>
            </div>
            
            {/* Visualizer Concept */}
            <div className="rounded-[40px] bg-white p-8 border border-slate-100 shadow-sm relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50" />
                <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-200" />
                <div className="absolute left-0 right-0 bottom-10 h-px bg-slate-200" />
                
                <motion.div 
                    animate={{ 
                        x: [0, Math.min(displacement * 2, 600)],
                        y: [0, acceleration > 0 ? 50 : 0]
                    }}
                    transition={{ duration: time, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute bottom-10 left-10 p-2"
                >
                    <div className="h-8 w-8 bg-blue-600 rounded-xl shadow-xl flex items-center justify-center">
                        <Magnet className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600">v={finalVelocity.toFixed(1)}</div>
                </motion.div>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Real-time Motion Trajectory Visualizer
                </div>
            </div>
        </div>
    );
};
