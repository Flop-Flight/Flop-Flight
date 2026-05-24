import { useState } from "react";
import { Sparkles, Copy, RefreshCw, Shield } from "lucide-react";

export const BioGenerator = () => {
    const [name, setName] = useState("");
    const [vibe, setVibe] = useState("Professional");
    const [bio, setBio] = useState("");

    const generateBio = () => {
        const bios: Record<string, string[]> = {
            Professional: [
                `${name} | Passionate about building digital experiences. Specializing in efficiency and creative problem solving.`,
                `${name} | Senior professional focused on innovation and results-driven strategies.`,
                `Experienced strategist | ${name} | Helping brands reach their full potential.`,
            ],
            Funny: [
                `${name}. 10% human, 90% caffeine. Professional procrastinator and snack enthusiast.`,
                `I’m not lazy, I’m just on energy-saving mode. Meet ${name}.`,
                `${name} | I followed my heart and it led me to the fridge.`,
            ],
            Creative: [
                `Dreamer. Creator. ${name}. Turning ideas into reality one day at a time.`,
                `Painting the world in my own colors. ${name} | Creative soul.`,
                `${name} | Crafting stories and capturing moments.`,
            ],
        };

        const list = bios[vibe] || bios.Professional;
        setBio(list[Math.floor(Math.random() * list.length)]);
    };

    return (
        <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div>
                    <label className="text-sm font-medium text-slate-700">Display Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="flex gap-2">
                    {["Professional", "Funny", "Creative"].map(v => (
                        <button
                          key={v}
                          onClick={() => setVibe(v)}
                          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${vibe === v ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                        >
                          {v}
                        </button>
                    ))}
                </div>

                <button
                    onClick={generateBio}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg active:scale-[0.98]"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Bio</span>
                </button>
            </div>

            {bio && (
                <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-6">
                    <p className="text-lg font-medium text-slate-800 leading-relaxed italic">"{bio}"</p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(bio)}
                      className="mt-4 flex items-center space-x-2 text-sm font-bold text-blue-600 hover:underline"
                    >
                        <Copy className="h-4 w-4" />
                        <span>Copy Bio</span>
                    </button>
                </div>
            )}
            
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-400">
                <Shield className="h-3 w-3" />
                <span>Your bio is generated locally | 100% Private</span>
            </div>
        </div>
    );
};
