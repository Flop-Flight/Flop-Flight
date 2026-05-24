import { useState, useEffect } from "react";
import { Atom, Info, Beaker, FlaskConical, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const elements = [
  { symbol: "H", name: "Hydrogen", atomicNumber: 1, mass: 1.008, group: "nonmetal" },
  { symbol: "He", name: "Helium", atomicNumber: 2, mass: 4.0026, group: "noble" },
  { symbol: "Li", name: "Lithium", atomicNumber: 3, mass: 6.94, group: "alkali" },
  { symbol: "Be", name: "Beryllium", atomicNumber: 4, mass: 9.0122, group: "alkaline" },
  { symbol: "B", name: "Boron", atomicNumber: 5, mass: 10.81, group: "metalloid" },
  { symbol: "C", name: "Carbon", atomicNumber: 6, mass: 12.011, group: "nonmetal" },
  { symbol: "N", name: "Nitrogen", atomicNumber: 7, mass: 14.007, group: "nonmetal" },
  { symbol: "O", name: "Oxygen", atomicNumber: 8, mass: 15.999, group: "nonmetal" },
  { symbol: "F", name: "Fluorine", atomicNumber: 9, mass: 18.998, group: "halogen" },
  { symbol: "Ne", name: "Neon", atomicNumber: 10, mass: 20.180, group: "noble" },
  { symbol: "Na", name: "Sodium", atomicNumber: 11, mass: 22.990, group: "alkali" },
  { symbol: "Mg", name: "Magnesium", atomicNumber: 12, mass: 24.305, group: "alkaline" },
  { symbol: "Al", name: "Aluminum", atomicNumber: 13, mass: 26.982, group: "post-transition" },
  { symbol: "Si", name: "Silicon", atomicNumber: 14, mass: 28.085, group: "metalloid" },
  { symbol: "P", name: "Phosphorus", atomicNumber: 15, mass: 30.974, group: "nonmetal" },
  { symbol: "S", name: "Sulfur", atomicNumber: 16, mass: 32.06, group: "nonmetal" },
  { symbol: "Cl", name: "Chlorine", atomicNumber: 17, mass: 35.45, group: "halogen" },
  { symbol: "Ar", name: "Argon", atomicNumber: 18, mass: 39.948, group: "noble" },
];

const groupColors: Record<string, string> = {
    nonmetal: "bg-blue-100 border-blue-200 text-blue-700",
    noble: "bg-purple-100 border-purple-200 text-purple-700",
    alkali: "bg-red-100 border-red-200 text-red-700",
    alkaline: "bg-orange-100 border-orange-200 text-orange-700",
    metalloid: "bg-emerald-100 border-emerald-200 text-emerald-700",
    halogen: "bg-indigo-100 border-indigo-200 text-indigo-700",
    "post-transition": "bg-slate-100 border-slate-200 text-slate-700",
};

export const PeriodicTable = () => {
    const [selected, setSelected] = useState(elements[0]);
    const [search, setSearch] = useState("");

    const filtered = elements.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase()) || 
        e.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 italic uppercase">Element Explorer</h2>
                <p className="text-slate-500 italic">Explore the building blocks of the universe.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Element Detail Card */}
                <div className="lg:col-span-1 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected.symbol}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="rounded-[40px] bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Atom className="h-32 w-32 animate-spin-slow" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Atomic Number {selected.atomicNumber}</span>
                                <h3 className="text-8xl font-black italic tracking-tighter">{selected.symbol}</h3>
                                <h4 className="text-2xl font-bold italic tracking-tight">{selected.name}</h4>
                                <div className="h-1 w-12 bg-white/10 rounded-full" />
                                <p className="text-sm font-medium text-slate-400">Mass: {selected.mass} u</p>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10`}>
                                    {selected.group}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="rounded-3xl bg-blue-50 p-6 flex flex-col items-center justify-center text-center space-y-3 border border-blue-100">
                        <FlaskConical className="h-6 w-6 text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-900 italic">Chemistry Lab Tip</p>
                        <p className="text-[10px] text-blue-700 leading-relaxed italic">
                            Elements in the same column (group) share similar chemical properties due to their electron configuration.
                        </p>
                    </div>
                </div>

                {/* Table Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search elements by name or symbol..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl bg-white p-4 pl-12 text-sm font-black italic tracking-tight border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {filtered.map((e) => (
                            <button
                                key={e.symbol}
                                onClick={() => setSelected(e)}
                                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
                                    selected.symbol === e.symbol 
                                    ? 'border-blue-600 bg-blue-600 text-white scale-110 shadow-lg z-10' 
                                    : `${groupColors[e.group] || 'bg-slate-50 border-slate-100'} hover:scale-105 active:scale-95`
                                }`}
                            >
                                <span className="text-[10px] font-bold opacity-60 self-start">{e.atomicNumber}</span>
                                <span className="text-xl font-black italic">{e.symbol}</span>
                                <span className="text-[8px] font-black uppercase tracking-tighter truncate w-full text-center mt-1">{e.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                        {Object.entries(groupColors).map(([group, color]) => (
                            <div key={group} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                <div className={`h-2 w-2 rounded-full ${color.split(' ')[0]}`} />
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap">{group}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
