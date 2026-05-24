import { useState } from "react";
import { Brain, Biohazard, TestTube, Microscope, Heart, Dna, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const organelles = [
  { id: "nucleus", name: "Nucleus", desc: "The control center containing DNA.", icon: Brain, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "mitochondria", name: "Mitochondria", desc: "Powerhouse of the cell, produces ATP.", icon: Heart, color: "text-rose-500", bg: "bg-rose-100" },
  { id: "ribosomes", name: "Ribosomes", desc: "Sites of protein synthesis.", icon: TestTube, color: "text-emerald-500", bg: "bg-emerald-100" },
  { id: "membrane", name: "Cell Membrane", desc: "Regulates entries and exits.", icon: Microscope, color: "text-amber-500", bg: "bg-amber-100" },
  { id: "dna", name: "DNA", desc: "Genetic blueprint of life.", icon: Dna, color: "text-indigo-500", bg: "bg-indigo-100" },
];

export const BiologyLab = () => {
  const [selected, setSelected] = useState(organelles[0]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase">Biology Bio-Sphere</h2>
        <p className="text-slate-500 italic">Interactive exploration of cellular structures and life sciences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-[40px] bg-white p-8 shadow-2xl border border-slate-100">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Select Organelle</h3>
            <div className="grid grid-cols-1 gap-3">
              {organelles.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`flex items-center space-x-4 p-4 rounded-3xl transition-all ${
                    selected.id === item.id 
                    ? 'bg-slate-900 text-white shadow-xl translate-x-2' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${selected.id === item.id ? 'bg-white/10' : item.bg}`}>
                    <item.icon className={`h-5 w-5 ${selected.id === item.id ? 'text-white' : item.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">{item.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-[40px] bg-slate-900 p-10 text-white shadow-2xl relative overflow-hidden flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/biological-cell.png')]" />
              <div className="relative z-10 space-y-6">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="inline-flex p-8 rounded-full bg-white/5 border border-white/10 mb-6"
                >
                  <selected.icon className="h-20 w-20 text-blue-400" />
                </motion.div>
                <h4 className="text-4xl font-black italic tracking-tighter uppercase">{selected.name}</h4>
                <p className="text-lg text-slate-400 italic max-w-sm">{selected.desc}</p>
                <div className="h-1 w-12 bg-blue-500/30 mx-auto rounded-full" />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="rounded-3xl bg-emerald-50 p-6 border border-emerald-100 flex items-start space-x-4">
             <div className="bg-white p-2 rounded-xl shadow-sm"><Info className="h-5 w-5 text-emerald-600" /></div>
             <p className="text-xs text-emerald-800 leading-relaxed italic font-medium">
               Did you know? Humans share about 99% of their DNA with chimpanzees, but also 60% with bananas! Life is more connected than it looks.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
