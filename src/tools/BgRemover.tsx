import { useState, useRef, ChangeEvent } from "react";
import { Upload, Trash2, Download, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { removeBackground } from "@imgly/background-removal";

export const BgRemover = () => {
    const [image, setImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);
    const [mode, setMode] = useState<'standard' | 'passport'>('standard');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Preparing...");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setProcessedImage(null);
                setIsRemoved(false);
                setProgress(0);
                setStatus("Ready to process");
            };
            reader.readAsDataURL(file);
        }
    };

    const processPhoto = async () => {
        if (!image) return;
        setIsRemoving(true);
        setProgress(0);
        setStatus("Initializing...");

        try {
            // Real background removal
            const config = {
                progress: (msg: string, p: number) => {
                    setProgress(Math.round(p * 100));
                    // Map common internal messages to more user-friendly ones
                    if (msg.includes("fetch")) setStatus("Downloading AI Models...");
                    else if (msg.includes("compute")) setStatus("Segmenting Subject...");
                    else if (msg.includes("inference")) setStatus("Analyzing Pixels...");
                    else setStatus(msg.charAt(0).toUpperCase() + msg.slice(1) + "...");
                }
            };

            const blob = await removeBackground(image, config);
            const url = URL.createObjectURL(blob);

            if (mode === 'passport') {
                const img = new Image();
                img.src = url;
                await new Promise((resolve) => { img.onload = resolve; });

                const canvas = document.createElement('canvas');
                canvas.width = 350;
                canvas.height = 450;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width - img.width * scale) / 2;
                    const y = (canvas.height - img.height * scale) / 2;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    setProcessedImage(canvas.toDataURL('image/png'));
                }
            } else {
                setProcessedImage(url);
            }

            setIsRemoved(true);
        } catch (error) {
            console.error("Background removal failed:", error);
            alert("Background removal failed. Please try a different image.");
        } finally {
            setIsRemoving(false);
        }
    };

    const downloadImage = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.download = mode === 'passport' ? 'passport_photo.png' : 'removed_bg.png';
        link.href = processedImage;
        link.click();
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">AI Background Remover</h2>
                <p className="text-slate-500 italic">True AI-powered background removal for any photo.</p>
            </div>

            {!image ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-[40px] border-4 border-dashed border-slate-100 bg-white transition-all hover:border-blue-200 hover:bg-blue-50/50 shadow-sm"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleUpload} 
                        className="hidden" 
                        accept="image/*" 
                    />
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 shadow-2xl transition-transform group-hover:scale-110">
                        <Upload className="h-10 w-10 text-white" />
                    </div>
                    <p className="mt-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Upload Image</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center gap-2 mb-4">
                        <button 
                            onClick={() => setMode('standard')}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'standard' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                            Transparent PNG
                        </button>
                        <button 
                            onClick={() => setMode('passport')}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'passport' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                            Passport Mode (White BG)
                        </button>
                    </div>

                    <div className="relative overflow-hidden rounded-[40px] bg-slate-100 aspect-video flex items-center justify-center border-8 border-white shadow-2xl group">
                        <AnimatePresence mode="wait">
                            {isRemoving ? (
                                <motion.div 
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-slate-900"
                                >
                                    {/* Blurred ghost image in background */}
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 0.3, scale: 1 }}
                                        className="absolute inset-0 z-0"
                                    >
                                        <img 
                                            src={image!} 
                                            alt="Processing ghost" 
                                            className="h-full w-full object-cover blur-xl grayscale"
                                        />
                                        <div className="absolute inset-0 bg-blue-900/50 mix-blend-overlay" />
                                    </motion.div>

                                    {/* Scanning line effect */}
                                    <motion.div 
                                        initial={{ top: "-10%" }}
                                        animate={{ top: "110%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 z-20 h-[2px] w-full bg-blue-400 shadow-[0_0_20px_#60a5fa,0_0_40px_#3b82f6]"
                                    />
                                    
                                    {/* Shimmer overlay */}
                                    <motion.div 
                                        animate={{ 
                                            opacity: [0.1, 0.3, 0.1],
                                            x: ["-100%", "100%"]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                                    />

                                    {/* Grid background */}
                                    <div className="absolute inset-0 z-10 opacity-[0.05] bg-[length:40px_40px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />

                                    <div className="relative z-30 flex flex-col items-center">
                                        <div className="relative mb-8">
                                            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30 scale-150" />
                                            <div className="relative h-28 w-28 flex items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl">
                                                <svg className="h-full w-full -rotate-90">
                                                    <circle
                                                        cx="56"
                                                        cy="56"
                                                        r="52"
                                                        stroke="rgba(255,255,255,0.05)"
                                                        strokeWidth="4"
                                                        fill="transparent"
                                                    />
                                                    <motion.circle
                                                        cx="56"
                                                        cy="56"
                                                        r="52"
                                                        stroke="#3b82f6"
                                                        strokeWidth="4"
                                                        fill="transparent"
                                                        strokeDasharray="326.7"
                                                        initial={{ strokeDashoffset: 326.7 }}
                                                        animate={{ strokeDashoffset: 326.7 - (progress / 100) * 326.7 }}
                                                        strokeLinecap="round"
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </svg>
                                                <div className="absolute flex flex-col items-center">
                                                    <span className="text-2xl font-black italic text-white tracking-tighter">{progress}%</span>
                                                    <div className="h-1 w-8 bg-blue-500/30 rounded-full mt-1 overflow-hidden">
                                                        <motion.div 
                                                            animate={{ x: ["-100%", "100%"] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                            className="h-full w-full bg-blue-400"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-center space-y-2">
                                            <motion.div 
                                                key={status}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-center space-x-2"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-white font-black italic tracking-widest text-sm uppercase">
                                                    {status}
                                                </span>
                                            </motion.div>
                                            
                                            <div className="flex flex-col items-center opacity-40">
                                                <p className="text-[10px] text-blue-300 uppercase font-black tracking-[0.2em]">
                                                    {progress < 20 ? "Accessing Core Models" : progress < 80 ? "Processing Neural Matrix" : "Finalizing Alpha Channel"}
                                                </p>
                                                {status.includes("Models") && (
                                                    <span className="text-[8px] text-white/60 mt-1 uppercase tracking-widest font-bold">Heavier models are cached for future use</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={isRemoved ? "processed" : "original"}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-full h-full flex items-center justify-center p-4"
                                >
                                    <img 
                                        src={isRemoved ? processedImage! : image} 
                                        alt="Output" 
                                        className={`max-h-full max-w-full object-contain transition-all ${isRemoved ? 'shadow-2xl ring-4 ring-white' : 'opacity-80'}`} 
                                    />
                                    {isRemoved && mode === 'standard' && (
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-4">
                        {!isRemoved ? (
                            <button
                                onClick={processPhoto}
                                disabled={isRemoving}
                                className="flex items-center space-x-2 rounded-2xl bg-slate-900 px-8 py-4 font-black text-white shadow-xl transition-all hover:bg-black active:scale-95 disabled:opacity-50 italic"
                            >
                                <Sparkles className="h-5 w-5" />
                                <span>{mode === 'passport' ? 'Generate Passport Photo' : 'Remove Background'}</span>
                            </button>
                        ) : (
                            <button 
                                onClick={downloadImage}
                                className="flex items-center space-x-2 rounded-2xl bg-emerald-600 px-8 py-4 font-black text-white shadow-xl transition-all hover:bg-emerald-700 active:scale-95 italic"
                            >
                                <Download className="h-5 w-5" />
                                <span>Download PNG</span>
                            </button>
                        )}
                        <button
                            onClick={() => { setImage(null); setIsRemoved(false); setProcessedImage(null); }}
                            className="flex items-center justify-center rounded-2xl bg-white p-4 text-slate-300 border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                        >
                            <Trash2 className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}

            <div className="rounded-3xl bg-blue-50 p-6 flex items-start space-x-4 border border-blue-100/50">
                <div className="rounded-xl bg-white p-2 shadow-sm text-blue-600">
                    <Sparkles className="h-6 w-6" />
                </div>
                <div>
                   <p className="text-xs font-black text-blue-900 uppercase tracking-widest italic">Real AI Processing</p>
                   <p className="text-[11px] text-blue-700 leading-relaxed mt-1 italic">Our model automatically detects the main subject and removes everything else. Standard mode gives you a transparent background, perfect for design. Passport mode creates a professional 3.5x4.5cm photo with a white background.</p>
                </div>
            </div>
        </div>
    );
};
