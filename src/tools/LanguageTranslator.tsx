import { useState, useRef, useEffect } from "react";
import { Languages, Mic, Send, Volume2, Copy, History, Sparkles, MessageSquare, Search, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { franc } from "franc-min";
import { GoogleGenAI } from "@google/genai";

const languages = [
  { code: "en", name: "English", country: "USA", flag: "🇺🇸", iso3: "eng" },
  { code: "hi", name: "Hindi", country: "India", flag: "🇮🇳", iso3: "hin" },
  { code: "es", name: "Spanish", country: "Spain", flag: "🇪🇸", iso3: "spa" },
  { code: "fr", name: "French", country: "France", flag: "🇫🇷", iso3: "fra" },
  { code: "de", name: "German", country: "Germany", flag: "🇩🇪", iso3: "deu" },
  { code: "it", name: "Italian", country: "Italy", flag: "🇮🇹", iso3: "ita" },
  { code: "ja", name: "Japanese", country: "Japan", flag: "🇯🇵", iso3: "jpn" },
  { code: "ko", name: "Korean", country: "South Korea", flag: "🇰🇷", iso3: "kor" },
  { code: "zh", name: "Chinese", country: "China", flag: "🇨🇳", iso3: "cmn" },
  { code: "ru", name: "Russian", country: "Russia", flag: "🇷🇺", iso3: "rus" },
  { code: "ar", name: "Arabic", country: "UAE", flag: "🇦🇪", iso3: "arb" },
  { code: "pt", name: "Portuguese", country: "Brazil", flag: "🇧🇷", iso3: "por" },
  { code: "tr", name: "Turkish", country: "Turkey", flag: "🇹🇷", iso3: "tur" },
  { code: "nl", name: "Dutch", country: "Netherlands", flag: "🇳🇱", iso3: "nld" },
  { code: "el", name: "Greek", country: "Greece", flag: "🇬🇷", iso3: "ell" },
  { code: "sv", name: "Swedish", country: "Sweden", flag: "🇸🇪", iso3: "swe" },
  { code: "id", name: "Indonesian", country: "Indonesia", flag: "🇮🇩", iso3: "ind" },
  { code: "vi", name: "Vietnamese", country: "Vietnam", flag: "🇻🇳", iso3: "vie" },
  { code: "th", name: "Thai", country: "Thailand", flag: "🇹🇭", iso3: "tha" },
  { code: "bn", name: "Bengali", country: "Bangladesh", flag: "🇧🇩", iso3: "ben" },
  { code: "pl", name: "Polish", country: "Poland", flag: "🇵🇱", iso3: "pol" },
  { code: "uk", name: "Ukrainian", country: "Ukraine", flag: "🇺🇦", iso3: "ukr" },
  { code: "fa", name: "Persian", country: "Iran", flag: "🇮🇷", iso3: "fas" },
  { code: "ur", name: "Urdu", country: "Pakistan", flag: "🇵🇰", iso3: "urd" },
  { code: "he", name: "Hebrew", country: "Israel", flag: "🇮🇱", iso3: "heb" },
];

export const LanguageTranslator = () => {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [fromLang, setFromLang] = useState("auto");
    const [detectedLang, setDetectedLang] = useState<string | null>(null);
    const [toLang, setToLang] = useState("hi");
    const [isTranslating, setIsTranslating] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Detect language as user types
    useEffect(() => {
        if (fromLang === "auto" && inputText.length > 3) {
            const iso3 = franc(inputText);
            const matched = languages.find(l => l.iso3 === iso3);
            if (matched) setDetectedLang(matched.code);
            else setDetectedLang(null);
        } else {
            setDetectedLang(null);
        }
    }, [inputText, fromLang]);

    const activeFromLang = fromLang === "auto" ? (detectedLang || "en") : fromLang;

    const translate = async () => {
        if (!inputText.trim()) return;
        setIsTranslating(true);
        setError(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const sourceLangName = languages.find(l => l.code === activeFromLang)?.name || "Auto-detected language";
            const targetLangName = languages.find(l => l.code === toLang)?.name || "Hindi";

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Translate to ${targetLangName} (from ${sourceLangName}). Return ONLY translated text.\nText: ${inputText}`,
            });

            const translatedText = response.text?.trim();

            if (translatedText) {
                setOutputText(translatedText);
            } else {
                throw new Error("Empty response from AI");
            }
        } catch (err: any) {
            console.error("Translation error:", err);
            setError("Translation failed. Please check your connection and try again.");
        } finally {
            setIsTranslating(false);
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        // If auto, don't set a specific lang to allow browser default/auto
        if (fromLang !== "auto") {
            recognition.lang = fromLang;
        }

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
            
            // If in auto mode, try to confirm the language from the result if API supports it
            if (fromLang === "auto") {
                const detectedIso3 = franc(transcript);
                const matched = languages.find(l => l.iso3 === detectedIso3);
                if (matched) setDetectedLang(matched.code);
            }
        };

        recognition.start();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Linguist AI</h2>
                <p className="text-slate-500 italic">Universal real-time translation with neural precision.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Area */}
                <div className="rounded-[40px] bg-white p-6 shadow-xl border border-slate-100 flex flex-col h-[450px] relative">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <select 
                                    value={fromLang}
                                    onChange={(e) => setFromLang(e.target.value)}
                                    className="text-[10px] font-black uppercase tracking-widest bg-slate-100 pl-8 pr-4 py-2 rounded-xl outline-none appearance-none border-2 border-transparent focus:border-blue-500 transition-all"
                                >
                                    <option value="auto">✨ Auto Detect</option>
                                    {languages.map(l => (
                                        <option key={`from-${l.code}`} value={l.code}>
                                            {l.flag} {l.country} ({l.name})
                                        </option>
                                    ))}
                                </select>
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            </div>
                            
                            <AnimatePresence>
                                {fromLang === "auto" && detectedLang && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic"
                                    >
                                        {languages.find(l => l.code === detectedLang)?.name}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button 
                            onClick={startListening}
                            className={`p-3 rounded-full transition-all group ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg ring-4 ring-red-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600'}`}
                        >
                            <Mic className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="relative flex-1">
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Start typing or speak to identify language..."
                            className="w-full h-full bg-transparent p-4 text-2xl font-black text-slate-900 resize-none outline-none placeholder:text-slate-200 placeholder:italic placeholder:font-medium"
                        />
                    </div>

                    <button 
                        onClick={translate}
                        disabled={isTranslating || !inputText.trim()}
                        className="mt-4 w-full rounded-3xl bg-slate-900 py-5 font-black text-white shadow-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:grayscale"
                    >
                        <AnimatePresence mode="wait">
                            {isTranslating ? (
                                <Sparkles className="h-5 w-5 animate-spin text-blue-400" />
                            ) : (
                                <Languages className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            )}
                        </AnimatePresence>
                        <span className="uppercase tracking-widest italic">Process Translation</span>
                    </button>
                </div>

                {/* Output Area */}
                <div className="rounded-[40px] bg-slate-900 p-6 shadow-2xl flex flex-col h-[450px] relative overflow-hidden group">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute -top-24 -right-24 h-64 w-64 bg-blue-600/20 blur-[100px] rounded-full" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <select 
                                value={toLang}
                                onChange={(e) => setToLang(e.target.value)}
                                className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl outline-none text-white border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                {languages.map(l => (
                                    <option key={`to-${l.code}`} value={l.code} className="bg-slate-900">
                                        {l.flag} {l.country} ({l.name})
                                    </option>
                                ))}
                            </select>

                            <div className="flex items-center space-x-1">
                                <button 
                                    onClick={copyToClipboard}
                                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                    title="Copy Translation"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                <button 
                                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                    title="Listen"
                                >
                                    <Volume2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                            <AnimatePresence mode="wait">
                                {isTranslating ? (
                                    <motion.div 
                                        key="loading"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="h-16 w-16 mb-6 relative">
                                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                                            <motion.div 
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
                                            />
                                            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-blue-500 animate-pulse" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 italic">Synthesizing Neural Result</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={outputText}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        {error ? (
                                            <div className="flex flex-col items-center space-y-4 text-red-400">
                                                <AlertCircle className="h-12 w-12" />
                                                <p className="text-sm font-bold italic">{error}</p>
                                                <button 
                                                    onClick={translate}
                                                    className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        ) : outputText ? (
                                            <>
                                                <p className="text-3xl font-black italic tracking-tighter text-white leading-tight">
                                                    {outputText}
                                                </p>
                                                <div className="h-1 w-12 bg-blue-500/30 mx-auto rounded-full" />
                                            </>
                                        ) : (
                                            <div className="opacity-10 space-y-4">
                                                <Languages className="h-16 w-16 mx-auto" />
                                                <p className="text-lg font-black uppercase tracking-widest italic">Awaiting Signal</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <AnimatePresence>
                            {copied && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border border-emerald-400"
                                >
                                    Copied to Clipboard
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Sparkles, color: "text-blue-600", bg: "bg-blue-50", title: "Neural Matrix", desc: "Proprietary AI sequence" },
                    { icon: Mic, color: "text-red-500", bg: "bg-red-50", title: "Voice Capture", desc: "Studio-grade sampling" },
                    { icon: MessageSquare, color: "text-slate-900", bg: "bg-slate-100", title: "Global Sync", desc: "100+ native dialects" }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="rounded-3xl bg-white p-5 border border-slate-100 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className={`${item.bg} p-3 rounded-2xl`}>
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase text-slate-900 italic">{item.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

