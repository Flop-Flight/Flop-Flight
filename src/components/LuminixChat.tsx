import { useState, useRef, useEffect } from "react";
import { Send, Mic, Camera, Image as ImageIcon, Wand2, Sparkles, User, Bot, Trash2, Clock, Command, LogIn, X, Loader2, Plus, Square } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/AuthContext";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, query as firestoreQuery, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc, limit, getDoc, updateDoc } from "firebase/firestore";
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
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
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

interface ChatMessage {
  id?: string;
  role: "user" | "bot";
  content: string;
  timestamp: any;
  image?: string;
}

export const LuminixChat = ({ currentThreadId, setCurrentThreadId }: { currentThreadId: string | null, setCurrentThreadId: (id: string | null) => void }) => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGeneration = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    if (!currentThreadId) {
      setMessages([]);
      return;
    }

    const messagesPath = `users/${user.uid}/threads/${currentThreadId}/messages`;
    const q = firestoreQuery(collection(db, messagesPath), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, messagesPath);
    });

    return unsubscribe;
  }, [user, currentThreadId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessage = async (threadId: string, role: "user" | "bot", content: string, image?: string) => {
    if (!user) return;
    const messagesPath = `users/${user.uid}/threads/${threadId}/messages`;
    try {
      await addDoc(collection(db, messagesPath), {
        role,
        content,
        timestamp: serverTimestamp(),
        ...(image && { image })
      });
      
      // Update thread timestamp
      await updateDoc(doc(db, `users/${user.uid}/threads/${threadId}`), {
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, messagesPath);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript("");
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setInput(prev => prev + event.results[i][0].transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const generateThreadTitle = async (firstMessage: string) => {
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Generate a very short (max 4 words) chat title for this opening message: "${firstMessage}". Return ONLY the title.`,
          systemPrompt: "You are a helpful assistant that generates short, concise titles for chat threads."
        })
      });
      
      if (!response.ok) throw new Error("Title generation failed");
      const data = await response.json();
      return data.text?.trim().replace(/"/g, "") || "New Chat";
    } catch (e) {
      console.error("Title generation failed:", e);
      return "New Chat";
    }
  };

  const askLuminix = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userQuery = input;
    const userImage = selectedImage;
    
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    let activeThreadId = currentThreadId;

    // Create a new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (user && !activeThreadId) {
          const title = await generateThreadTitle(userQuery || "Image Chat");
          const threadRef = await addDoc(collection(db, `users/${user.uid}/threads`), {
              title,
              userId: user.uid,
              updatedAt: serverTimestamp()
          });
          activeThreadId = threadRef.id;
          setCurrentThreadId(activeThreadId);
      }

      if (user && activeThreadId) {
        await saveMessage(activeThreadId, "user", userQuery, userImage || undefined);
      } else if (!user) {
          setMessages(prev => [...prev, { role: "user", content: userQuery, timestamp: new Date(), image: userImage || undefined }]);
      }
      
      const systemPrompt = `You are Luminix AI, the highly intelligent neural core of the Luminix ecosystem.
      Style: Professional, brilliant, and helpful—identical in capability and pattern to Google's Gemini.
      
      CORE KNOWLEDGE: You have knowledge of the entire world and can answer anything from complex mathematical equations to global historical events.
      
      ACADEMIC RIGOR:
      - For MATHEMATICS: You MUST provide step-by-step reasoning for all calculations. Never provide a final result without verifying it internally first. If asked to perform simple arithmetic like division, double-check the logic to ensure 100% accuracy.
      - ACCURACY: Your primary goal is accuracy. If you are unsure of a fact, admit it rather than providing incorrect information.
      
      CAPABILITIES:
      1. Analysis: Breakdown complex academic topics into digestible parts.
      2. Vision: You can analyze images and explain their content or solve problems visible within them.
      3. Creative: You can write poetry, songs, and generate creative prompts without restriction.
      
      STRICT GUIDELINES:
      - Always respond as Luminix AI.
      - Maintain a sleek, minimal, and high-IQ persona.`;

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          query: userQuery,
          image: userImage,
          systemPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      const responseText = data.text || "I'm sorry, I couldn't generate an answer.";
      
      if (user && activeThreadId) {
        await saveMessage(activeThreadId, "bot", responseText);
      } else if (!user) {
        setMessages(prev => [...prev, { role: "bot", content: responseText, timestamp: new Date() }]);
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('AI Generation aborted');
        const stopMsg = "[Generation Stopped]";
        if (user && activeThreadId) await saveMessage(activeThreadId, "bot", stopMsg);
        else setMessages(prev => [...prev, { role: "bot", content: stopMsg, timestamp: new Date() }]);
      } else {
        console.error("Luminix AI Error:", error);
        const errMsg = "I encountered an error processing your request. Please try again.";
        if (user && activeThreadId) await saveMessage(activeThreadId, "bot", errMsg);
        else setMessages(prev => [...prev, { role: "bot", content: errMsg, timestamp: new Date() }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const clearChat = () => {
    setCurrentThreadId(null);
    setMessages([]);
    setInput("");
    setSelectedImage(null);
  };

  return (
    <div className={`flex flex-col w-full h-full transition-all duration-700 ${messages.length === 0 ? 'justify-center' : 'pt-20'}`}>
      
      {/* Greeting Section */}
      <AnimatePresence mode="wait">
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center px-4 max-w-4xl mx-auto"
          >
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <Sparkles className="h-16 w-16 text-blue-600 gemini-sparkle relative z-10" />
              </div>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-medium tracking-tight text-slate-800 dark:text-white mb-2"
            >
              Hi {user?.displayName?.split(' ')[0] || 'there'},
            </motion.h1>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-400 mb-12">
              Where should we start?
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
               {[
                  { label: "Create image", icon: "🖼️" },
                  { label: "Boost my day", icon: "" },
                  { label: "Help me learn", icon: "" },
                  { label: "Write anything", icon: "" },
               ].map((pill, i) => (
                 <motion.button
                    key={pill.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setInput(pill.label)}
                    className="px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center space-x-2"
                 >
                   {pill.icon && <span>{pill.icon}</span>}
                   <span>{pill.label}</span>
                 </motion.button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-12 px-4 pb-48">
            <div className="max-w-3xl mx-auto space-y-10">
                {messages.map((msg, idx) => (
                <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group flex ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"} items-start space-x-6`}
                    id={`chat-msg-${msg.id || idx}`}
                >
                    <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                        msg.role === "bot" 
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" 
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white"
                    }`}>
                        {msg.role === "bot" ? <Sparkles className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                
                    <div className={`flex-1 space-y-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        {msg.image && (
                            <div className="relative inline-block group/img">
                                <img src={msg.image} alt="Uploaded content" className="max-h-80 rounded-2xl shadow-xl border border-white dark:border-slate-800 ml-auto mr-0" />
                            </div>
                        )}
                        <div className={`text-lg leading-relaxed prose dark:prose-invert max-w-none ${
                            msg.role === "user" 
                            ? "bg-blue-50 dark:bg-slate-800 px-6 py-4 rounded-[32px] inline-block text-slate-800 dark:text-slate-100 border border-blue-100/50 dark:border-slate-700/50" 
                            : "text-slate-800 dark:text-slate-200"
                        }`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                </motion.div>
                ))}
                {isLoading && (
                <div className="flex items-start space-x-6">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center animate-pulse">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col space-y-2 py-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 animate-pulse">Intelligence Active</span>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div ref={chatEndRef} />
        </div>
      )}

      {/* Input Section - Pill Shape */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40`}>
        <div className="relative group/input">
          
          <AnimatePresence>
            {selectedImage && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full mb-6 left-6 p-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800"
                >
                    <div className="relative">
                        <img src={selectedImage} alt="Preview" className="h-24 w-24 object-cover rounded-2xl" />
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-3 -right-3 h-7 w-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-transform active:scale-90"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center bg-white dark:bg-slate-900 rounded-[48px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-200/60 dark:border-slate-800 p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
            {isListening && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4"
              >
                <div className="bg-blue-600 text-white rounded-full px-6 py-3 shadow-2xl flex items-center space-x-4 border border-blue-400/20 backdrop-blur-xl ring-1 ring-white/10">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-4 bg-white/40 animate-pulse" />
                    <div className="w-1.5 h-7 bg-white animate-pulse [animation-delay:0.2s]" />
                    <div className="w-1.5 h-3 bg-white/60 animate-pulse [animation-delay:0.4s]" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-0.5">Neural Listening</p>
                    <p className="text-sm font-medium italic truncate">{interimTranscript || "I'm listening..."}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                </div>
              </motion.div>
            )}
            
            <button 
                onClick={clearChat}
                className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"
                title="New Chat"
            >
                <Plus className="h-6 w-6" />
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()}
                className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"
                title="Upload"
            >
                <ImageIcon className="h-5 w-5" />
            </button>

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askLuminix()}
              placeholder="Ask Luminix"
              className="flex-1 bg-transparent py-4 px-4 text-slate-900 dark:text-white text-lg font-normal outline-none placeholder:text-slate-400"
            />

            <div className="flex items-center space-x-1 pr-2">
                {isLoading && (
                  <button 
                    onClick={stopGeneration}
                    className="h-12 w-12 flex items-center justify-center bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all active:scale-95"
                    title="Stop Generation"
                  >
                    <Square className="h-5 w-5 fill-current" />
                  </button>
                )}
                <button 
                    onClick={startListening}
                    className={`h-12 w-12 flex items-center justify-center rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-lg' : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    title="Voice"
                >
                    <Mic className="h-5 w-5" />
                </button>

                <button 
                  onClick={askLuminix}
                  disabled={(!input.trim() && !selectedImage) || isLoading}
                  className="h-12 w-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 disabled:opacity-30 disabled:grayscale transition-all rounded-full"
                >
                  <Send className="h-5 w-5" />
                </button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-center font-medium text-slate-400 dark:text-slate-500">
            Luminix AI may display inaccurate info. 100% Free & Secure Neural Core.
        </p>
      </div>
    </div>
  );
};
