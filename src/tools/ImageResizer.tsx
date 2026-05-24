import { useState, useRef, ChangeEvent } from "react";
import { Upload, Trash2, Download, Maximize2, Layers, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const ImageResizer = () => {
    const [image, setImage] = useState<string | null>(null);
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(1080);
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(16/9);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setImage(event.target?.result as string);
                    setWidth(img.width);
                    setHeight(img.height);
                    setAspectRatio(img.width / img.height);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWidthChange = (val: number) => {
        setWidth(val);
        if (maintainAspect) {
            setHeight(Math.round(val / aspectRatio));
        }
    };

    const handleHeightChange = (val: number) => {
        setHeight(val);
        if (maintainAspect) {
            setWidth(Math.round(val * aspectRatio));
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 italic">Image Resizer & Optimizer</h2>
                <p className="text-slate-500 italic">Compress and resize images for any platform without losing quality.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    {!image ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-white transition-all hover:bg-slate-50"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleUpload} 
                                className="hidden" 
                                accept="image/*" 
                            />
                            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl transition-transform group-hover:scale-110">
                                <Upload className="h-10 w-10" />
                            </div>
                            <p className="mt-6 text-xs font-black uppercase tracking-widest text-slate-400">Click to resize</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative aspect-square overflow-hidden rounded-[32px] border-4 border-white bg-slate-100 shadow-2xl">
                                <img src={image} alt="Preview" className="h-full w-full object-contain" />
                                <button 
                                    onClick={() => setImage(null)}
                                    className="absolute right-4 top-4 rounded-full bg-red-600 p-2 text-white shadow-lg transition-transform hover:scale-110"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Original Format: PNG/JPG</span>
                                <span>Ready to process</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-8 rounded-[40px] bg-slate-900 p-8 text-white">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Width (px)</label>
                                <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-bold">Recommended</span>
                            </div>
                            <input 
                                type="number" 
                                value={width}
                                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                                className="w-full rounded-2xl bg-slate-800 p-4 text-xl font-black outline-none ring-1 ring-slate-700 transition-all focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Height (px)</label>
                            <input 
                                type="number" 
                                value={height}
                                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                                className="w-full rounded-2xl bg-slate-800 p-4 text-xl font-black outline-none ring-1 ring-slate-700 transition-all focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => setMaintainAspect(!maintainAspect)}
                                className={`h-6 w-11 rounded-full transition-colors ${maintainAspect ? 'bg-blue-600' : 'bg-slate-700'}`}
                            >
                                <motion.div 
                                    animate={{ x: maintainAspect ? 22 : 4 }}
                                    className="h-4 w-4 rounded-full bg-white" 
                                />
                            </button>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Lock Aspect Ratio</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-slate-800/50 p-4 border border-slate-700/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Preset</p>
                            <p className="text-sm font-bold">4K Desktop</p>
                        </div>
                        <div className="rounded-2xl bg-slate-800/50 p-4 border border-slate-700/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Format</p>
                            <p className="text-sm font-bold">WebP (Best)</p>
                        </div>
                    </div>

                    <button 
                        disabled={!image}
                        className="group relative w-full overflow-hidden rounded-2xl bg-white p-5 font-black text-slate-900 transition-all hover:bg-white active:scale-[0.98] disabled:opacity-30"
                    >
                        <div className="relative z-10 flex items-center justify-center space-x-2 italic">
                            <Maximize2 className="h-5 w-5" />
                            <span>Resize & Download</span>
                        </div>
                        <div className="absolute inset-0 bg-blue-600 opacity-0 transition-opacity group-hover:opacity-10" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Layers, title: "Lossless", text: "No compression artifacts" },
                    { icon: Sparkles, title: "AI Scaling", text: "Enhanced edge detection" },
                    { icon: Maximize2, title: "Custom", text: "Any dimension you need" }
                ].map((feature, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-white border border-slate-100">
                        <div className="rounded-xl bg-slate-50 p-3">
                            <feature.icon className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-tighter text-slate-900">{feature.title}</p>
                            <p className="text-[10px] text-slate-500">{feature.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
