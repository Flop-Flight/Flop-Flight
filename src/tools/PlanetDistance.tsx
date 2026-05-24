import { useState, useEffect } from "react";
import { Telescope, Info, ArrowRightLeft } from "lucide-react";
import { motion } from "motion/react";

const planets = [
  { name: "Mercury", distance: 0.39 },
  { name: "Venus", distance: 0.72 },
  { name: "Earth", distance: 1.00 },
  { name: "Mars", distance: 1.52 },
  { name: "Jupiter", distance: 5.20 },
  { name: "Saturn", distance: 9.54 },
  { name: "Uranus", distance: 19.19 },
  { name: "Neptune", distance: 30.07 },
  { name: "Pluto", distance: 39.48 },
];

export const PlanetDistance = () => {
  const [planetA, setPlanetA] = useState("Earth");
  const [planetB, setPlanetB] = useState("Mars");
  const [distanceAU, setDistanceAU] = useState(0);

  useEffect(() => {
    const distA = planets.find(p => p.name === planetA)?.distance || 0;
    const distB = planets.find(p => p.name === planetB)?.distance || 0;
    setDistanceAU(Math.abs(distA - distB));
  }, [planetA, planetB]);

  const km = distanceAU * 149597870.7; // 1 AU in km

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Cosmic Distance Calc</h2>
        <p className="text-slate-500 italic">Calculate the average distance between planets in our solar system.</p>
      </div>

      <div className="rounded-[40px] bg-white p-8 shadow-2xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Planet</label>
            <div className="grid grid-cols-3 gap-2">
              {planets.map((p) => (
                <button
                  key={`a-${p.name}`}
                  onClick={() => setPlanetA(p.name)}
                  className={`p-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                    planetA === p.name ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Second Planet</label>
            <div className="grid grid-cols-3 gap-2">
              {planets.map((p) => (
                <button
                  key={`b-${p.name}`}
                  onClick={() => setPlanetB(p.name)}
                  className={`p-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                    planetB === p.name ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-10 text-white shadow-2xl group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.2),transparent)] opacity-50" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <Telescope className="h-12 w-12 text-blue-400 mb-4 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400/60 mb-2">Average Distance</p>
            <motion.div 
              key={distanceAU}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-5xl font-black italic tracking-tighter">
                {distanceAU.toFixed(2)} <span className="text-2xl not-italic">AU</span>
              </h3>
              <p className="text-xl font-bold text-slate-400 italic">
                ≈ {km.toLocaleString(undefined, { maximumFractionDigits: 0 })} km
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-blue-50 p-6 flex items-start space-x-4 border border-blue-100/50">
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-xs text-blue-700 leading-relaxed italic">
            Distances are based on average orbital radii from the Sun. 1 AU (Astronomical Unit) is approximately the distance from the Earth to the Sun (150 million km).
          </p>
        </div>
      </div>
    </div>
  );
};
