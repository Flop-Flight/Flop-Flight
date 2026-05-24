import { useState, useEffect, useRef } from "react";
import { GraduationCap, Send, BookOpen, Atom, Binary, Brain, Sparkles, Wand2, History as HistoryIcon, Mic, Command, Trash2, Clock, LogIn, Square } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/AuthContext";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, query as firestoreQuery, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(p => ({ providerId: p.providerId, email: p.email })) || []
    }
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface HistoryItem {
    id: string;
    query: string;
    answer: string;
    subject: string;
    timestamp: any;
}

export const LuminixAI = () => {
    const { user } = useAuth();
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState("general");
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const stopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'Enter' && query.trim() && !isLoading) {
                askAI();
            }
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [query, isLoading]);

    useEffect(() => {
        if (!user) {
            setHistory([]);
            return;
        }

        const historyPath = `users/${user.uid}/history`;
        const q = firestoreQuery(collection(db, historyPath), orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as HistoryItem[];
            setHistory(items);
        }, (error) => {
            handleFirestoreError(error, OperationType.GET, historyPath);
        });

        return unsubscribe;
    }, [user]);

    const saveToHistory = async (q: string, a: string) => {
        if (!user) return;
        const historyPath = `users/${user.uid}/history`;
        try {
            await addDoc(collection(db, historyPath), {
                userId: user.uid,
                query: q,
                answer: a,
                subject,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, historyPath);
        }
    };

    const deleteHistoryItem = async (id: string) => {
        if (!user) return;
        const path = `users/${user.uid}/history/${id}`;
        try {
            await deleteDoc(doc(db, path));
        } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, path);
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setInterimTranscript("");
        };
        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript("");
        };
        recognition.onerror = () => {
            setIsListening(false);
            setInterimTranscript("");
        };

        recognition.onresult = (event: any) => {
            let interim = "";
            for (let i = event.resultsIndex || event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setQuery(prev => prev + (prev ? " " : "") + event.results[i][0].transcript);
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            setInterimTranscript(interim);
        };

        recognition.start();
    };

    const subjects = [
        { id: "general", name: "General Study", icon: GraduationCap, color: "blue" },
        { id: "physics", name: "Physics", icon: Atom, color: "indigo" },
        { id: "chemistry", name: "Chemistry", icon: Sparkles, color: "emerald" },
        { id: "math", name: "Mathematics", icon: Binary, color: "orange" },
        { id: "biology", name: "Biology", icon: Brain, color: "rose" },
        { id: "history", name: "History", icon: HistoryIcon, color: "amber" },
        { id: "geography", name: "Geography", icon: BookOpen, color: "cyan" },
    ];

    const askAI = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setAnswer("");
        
        // Create a new AbortController
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    query,
                    subject,
                    systemPrompt: `Your sole identity is Luminix AI, the official intelligence of the Luminix study platform.
            You provide clear, expert-level academic assistance. You do not refer to yourself by any other name.
            Your goal is to help students learn efficiently, explain complex topics simply, and provide accurate information.
            Always maintain a professional and helpful tone as Luminix AI.
            
            Subject Context: ${subject.toUpperCase()}. 
            
            ACADEMIC GUIDELINES:
            1. For MATHEMATICS (or any calculation): You MUST show your step-by-step reasoning. Never give a final answer without verifying the intermediate steps. If the user asks for a simple division, double-check the calculation carefully.
            2. STRUCTURE: Provide hyper-concise, rapid, and structured explanations.
            3. METHODS: Use bullet points, bold key terms, and "TL;DR" summaries.
            4. ACCURACY: Accuracy is your top priority. If you are unsure about a specific fact, state it clearly rather than guessing.
            
            SAFETY RULES:
            1. Strictly educational content only.
            2. Never provide harmful, toxic, or age-inappropriate content.
            3. If a query is non-educational or sensitive (e.g. 18+ content), politely steer back to academics or state you cannot assist with that.
            4. Focus on clarity and ease of understanding.`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get AI response");
            }

            const data = await response.json();
            const resultText = data.text || "I'm sorry, I couldn't generate an answer.";
            setAnswer(resultText);
            
            if (user) {
                saveToHistory(query, resultText);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('AI Generation aborted');
                setAnswer(prev => prev + "\n\n[Generation Stopped]");
            } else {
                console.error("Luminix AI Error:", error);
                setAnswer("I encountered a problem accessing my knowledge base. Please try again.");
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl mb-4 dark:shadow-blue-900/20">
                    <GraduationCap className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter uppercase leading-tight">Luminix AI</h2>
                <p className="text-slate-500 dark:text-slate-400 italic">Official Intelligence of the Luminix Study Platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar: Subjects & History */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Focus Mode</p>
                        {subjects.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSubject(s.id)}
                                className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all ${
                                    subject === s.id 
                                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg scale-105 z-10' 
                                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
                                }`}
                            >
                                <s.icon className={`h-5 w-5 ${subject === s.id ? 'text-blue-400 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                                <span className="text-xs font-black uppercase tracking-widest">{s.name}</span>
                            </button>
                        ))}
                    </div>

                    {user && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">History</p>
                                <button 
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="text-[10px] font-black text-blue-600 uppercase"
                                >
                                    {showHistory ? 'Hide' : 'Show All'}
                                </button>
                            </div>
                            
                            {showHistory && (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                                    {history.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="group relative rounded-2xl bg-white dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all cursor-pointer"
                                            onClick={() => {
                                                setQuery(item.query);
                                                setAnswer(item.answer);
                                                setSubject(item.subject);
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{item.subject}</span>
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteHistoryItem(item.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{item.query}</p>
                                        </div>
                                    ))}
                                    {history.length === 0 && (
                                        <p className="text-center py-8 text-[10px] font-bold text-slate-400 uppercase italic">No history yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    <div className="rounded-[40px] bg-white dark:bg-slate-800 p-8 shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                        {!user && (
                            <div className="absolute top-4 left-4 right-4 z-20 flex justify-center">
                                <div className="rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 flex items-center space-x-2 text-[10px] font-black uppercase text-amber-600 tracking-widest animate-pulse">
                                    <LogIn className="h-3 w-3" />
                                    <span>Sign in to save chat history</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10">
                            <BookOpen className="h-32 w-32 dark:text-white" />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 italic">What are you studying today?</label>
                                    <div className="flex items-center space-x-1 text-[8px] font-black uppercase text-slate-300 dark:text-slate-600">
                                        <Command className="h-2 w-2" />
                                        <span>Ctrl + Enter to Ask</span>
                                    </div>
                                </div>
                                    <div className="relative">
                                        <textarea 
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Ask about math, science, or history..."
                                            className="w-full rounded-[32px] bg-slate-50 dark:bg-slate-900 p-6 pr-32 text-lg font-medium text-slate-900 dark:text-white border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none h-32 resize-none"
                                        />

                                        <AnimatePresence>
                                            {isListening && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute -top-12 left-0 right-0 z-30 flex justify-center"
                                                >
                                                    <div className="bg-blue-600 text-white rounded-full px-6 py-2 shadow-xl border border-blue-400/30 flex items-center space-x-3 backdrop-blur-md">
                                                        <div className="flex space-x-1">
                                                            <div className="w-1 h-3 bg-white/40 animate-pulse" />
                                                            <div className="w-1 h-5 bg-white animate-pulse [animation-delay:0.2s]" />
                                                            <div className="w-1 h-2 bg-white/60 animate-pulse [animation-delay:0.4s]" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Listening:</span>
                                                        <span className="text-xs font-bold italic truncate max-w-[200px]">
                                                            {interimTranscript || "..."}
                                                        </span>
                                                        <div className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="absolute bottom-4 right-4 flex space-x-2">
                                            {isLoading && (
                                                <button 
                                                    onClick={stopGeneration}
                                                    className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all active:scale-95"
                                                    title="Stop Generation"
                                                >
                                                    <Square className="h-5 w-5 fill-current" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={startListening}
                                                className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                                                    isListening 
                                                    ? 'bg-rose-500 text-white animate-pulse' 
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                <Mic className={`h-5 w-5 ${isListening ? 'animate-bounce' : ''}`} />
                                            </button>
                                            <button 
                                                onClick={askAI}
                                                disabled={isLoading || !query.trim()}
                                                className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {isLoading ? <Wand2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {answer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-[32px] bg-slate-900 dark:bg-slate-950 p-8 text-white relative group"
                                    >
                                        <div className="absolute top-4 right-6 flex items-center space-x-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Rapid Answer Active</span>
                                        </div>
                                        
                                        <div className="prose prose-invert max-w-none text-slate-100">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
                                        </div>
                                        
                                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-500">
                                            <span>Source: Luminix AI Neural Core</span>
                                            <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                                                <Sparkles className="h-3 w-3" />
                                                <span>Summarize Further</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!answer && !isLoading && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 italic text-xs text-blue-700 flex items-center space-x-3">
                                        <div className="bg-white p-2 rounded-xl shadow-sm"><GraduationCap className="h-4 w-4 text-blue-600" /></div>
                                        <span>"Explain Quantum Entanglement simply"</span>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 italic text-xs text-indigo-700 flex items-center space-x-3">
                                        <div className="bg-white p-2 rounded-xl shadow-sm"><Binary className="h-4 w-4 text-indigo-600" /></div>
                                        <span>"Solve x^2 + 5x + 6 = 0"</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
