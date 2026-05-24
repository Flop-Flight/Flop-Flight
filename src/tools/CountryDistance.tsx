import { useState, useEffect } from "react";
import { Globe, MapPin, Navigation, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const countries = [
  { name: "USA", lat: 37.0902, lng: -95.7129 },
  { name: "India", lat: 20.5937, lng: 78.9629 },
  { name: "UK", lat: 55.3781, lng: -3.4360 },
  { name: "Australia", lat: -25.2744, lng: 133.7751 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253 },
  { name: "Canada", lat: 56.1304, lng: -106.3468 },
  { name: "China", lat: 35.8617, lng: 104.1954 },
  { name: "Japan", lat: 36.2048, lng: 138.2529 },
  { name: "Germany", lat: 51.1657, lng: 10.4515 },
  { name: "France", lat: 46.2276, lng: 2.2137 },
  { name: "Russia", lat: 61.5240, lng: 105.3188 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375 },
  { name: "UAE", lat: 23.4241, lng: 53.8478 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Mexico", lat: 23.6345, lng: -102.5528 },
];

export const CountryDistance = () => {
    const [from, setFrom] = useState("India");
    const [to, setTo] = useState("USA");
    const [distance, setDistance] = useState(0);

    const calculateDistance = () => {
        const c1 = countries.find(c => c.name === from);
        const c2 = countries.find(c => c.name === to);
        if (!c1 || !c2) return;

        const R = 6371; // Earth's radius in km
        const dLat = (c2.lat - c1.lat) * Math.PI / 180;
        const dLon = (c2.lng - c1.lng) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        setDistance(R * c);
    };

    useEffect(() => {
        calculateDistance();
    }, [from, to]);

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 italic uppercase">Global Range Finder</h2>
                <p className="text-slate-500 italic">Calculate the straight-line distance between major countries.</p>
            </div>

            <div className="rounded-[40px] bg-white p-8 shadow-2xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">Departure</label>
                        <select 
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full rounded-[24px] bg-slate-50 p-5 font-black text-slate-900 border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all outline-none appearance-none"
                        >
                            {countries.map(c => <option key={`f-${c.name}`} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">Destination</label>
                        <select 
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full rounded-[24px] bg-slate-50 p-5 font-black text-slate-900 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none appearance-none"
                        >
                            {countries.map(c => <option key={`t-${c.name}`} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="relative aspect-[21/9] flex flex-col items-center justify-center rounded-[32px] bg-slate-900 text-white overflow-hidden shadow-inner">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')]" />
                    <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <Navigation className="h-8 w-8 text-blue-400 mb-2 animate-bounce" />
                        <motion.div
                            key={distance}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <h3 className="text-6xl font-black italic tracking-tighter">
                                {distance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                <span className="text-xl not-italic ml-2 text-blue-400">KM</span>
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Surface Distance (Air)</p>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400">Miles</p>
                            <p className="text-sm font-black text-slate-900">{(distance * 0.621371).toLocaleString(undefined, { maximumFractionDigits: 0 })} mi</p>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100 flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <div>
                            <p className="text-[9px] font-black uppercase text-blue-400">Algorithm</p>
                            <p className="text-sm font-black text-blue-900 italic">Haversine</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex items-start space-x-3 rounded-2xl bg-amber-50 p-4 border border-amber-100">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 italic leading-relaxed">
                        Distances are calculated as the direct "great-circle" path between the geographical centers of each country. Actual travel distance may vary.
                    </p>
                </div>
            </div>
        </div>
    );
};
