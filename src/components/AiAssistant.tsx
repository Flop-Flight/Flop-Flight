import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Sparkles, ArrowRight, Info, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toolsConfig } from "../config/toolsConfig";

export const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("luminix-ai-tutorial-v1");
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("luminix-ai-tutorial-v1", "true");
  };
  const [messages, setMessages] = useState<Array<{ 
    role: 'ai' | 'user', 
    text: string, 
    suggestions?: Array<{ id: string, name: string, description: string, category: string }> 
  }>>([
    { 
      role: 'ai', 
      text: "Hi! I'm Luminix AI, your expert academic assistant. I can help you find tools or explain topics. What's on your mind?",
      suggestions: [
        { id: 'scholar-ai', name: 'Luminix AI (Tutor)', description: 'Ask any academic question.', category: 'Misc' },
        { id: 'language-translator', name: 'Linguist AI', description: 'Voice & text translation.', category: 'Misc' },
        { id: 'periodic-table', name: 'Chemistry Table', description: 'Explore elements.', category: 'Math/Finance' }
      ]
    }
  ]);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuery("");

    // Simulate AI response logic
    setTimeout(() => {
      const lowerQuery = userMessage.toLowerCase();
      
      // Synonym mapping for better search
      const synonyms: Record<string, string[]> = {
        "converter": ["change", "switch", "transform", "swap"],
        "calculator": ["calc", "math", "figure out", "compute"],
        "generator": ["maker", "create", "build", "craft"],
        "remove": ["clear", "cut", "delete", "erase"],
        "resize": ["small", "big", "scale", "dimension"],
      };

      // Find keywords considering synonyms
      const getQueryWords = (q: string) => {
        const words = q.split(/\s+/);
        const extended = [...words];
        words.forEach(w => {
          if (synonyms[w]) extended.push(...synonyms[w]);
        });
        return extended;
      };

      const queryWords = getQueryWords(lowerQuery);

      // 1. Check for specific tool matches (using name, id, and keywords)
      const matchedTools = toolsConfig.filter(tool => {
        const toolName = tool.name.toLowerCase();
        const toolId = tool.id.replace(/-/g, " ").toLowerCase();
        const toolKeywords = tool.keywords?.map(k => k.toLowerCase()) || [];
        
        return queryWords.some(word => 
          toolName.includes(word) || 
          toolId.includes(word) || 
          toolKeywords.some(k => k.includes(word))
        );
      });

      if (matchedTools.length === 1) {
        const tool = matchedTools[0];
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `I've found exactly what you need! The ${tool.name} tool is ready for you.`,
          suggestions: [{ id: tool.id, name: tool.name, description: tool.description, category: tool.category }]
        }]);
        return;
      } else if (matchedTools.length > 1) {
        setMessages(prev => [...prev, {
          role: 'ai',
          text: "I found a few tools that might match your needs. Which one works best for you?",
          suggestions: matchedTools.map(t => ({ id: t.id, name: t.name, description: t.description, category: t.category }))
        }]);
        return;
      }

      // 2. Check for category-level or vague queries
      const categories = ["Writing", "Tech/Dev", "Math/Finance", "Images", "Misc"];
      const matchedCategory = categories.find(cat => lowerQuery.includes(cat.toLowerCase()));

      if (matchedCategory) {
        const categoryTools = toolsConfig.filter(t => t.category === matchedCategory).slice(0, 3);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `You're exploring ${matchedCategory} tools! Here are the most recommended ones for you:`,
          suggestions: categoryTools.map(t => ({ id: t.id, name: t.name, description: t.description, category: t.category }))
        }]);
        return;
      }

      // 3. Handle vague keywords for broader suggestions
      const vagueSuggestions: Record<string, { text: string, category?: string }> = {
        "calculate": { text: "Calculations are my specialty. I have tools for EMI, GST, age, and percentages. What are we figuring out today?", category: "Math/Finance" },
        "math": { text: "Calculations are my specialty. I have tools for EMI, GST, age, and percentages. What are we figuring out today?", category: "Math/Finance" },
        "number": { text: "Calculations are my specialty. I have tools for EMI, GST, age, and percentages. What are we figuring out today?", category: "Math/Finance" },
        "pick": { text: "Looking to pick something randomly? I can help with numbers or winner names!", category: "Misc" },
        "write": { text: "I can help you write faster! Whether it's a resume, a bio, or a professional email, I have a tool for it. What's the project?", category: "Writing" },
        "edit": { text: "Need to tweak something? I have tools for image resizing, background removal, and text formatting.", category: "Images" },
        "generate": { text: "I can help you write faster! Whether it's a resume, a bio, or a professional email, I have a tool for it. What's the project?", category: "Writing" },
        "text": { text: "I can help you write faster! Whether it's a resume, a bio, or a professional email, I have a tool for it. What's the project?", category: "Writing" },
        "image": { text: "I can edit images instantly! Need a background removed or a photo resized? Let me know!", category: "Images" },
        "photo": { text: "I can edit images instantly! Need a background removed or a photo resized? Let me know!", category: "Images" },
        "picture": { text: "I can edit images instantly! Need a background removed or a photo resized? Let me know!", category: "Images" },
      };

      for (const key in vagueSuggestions) {
        if (lowerQuery.includes(key)) {
          const suggestion = vagueSuggestions[key];
          const relevantTools = suggestion.category ? toolsConfig.filter(t => t.category === suggestion.category).slice(0, 2) : [];
          setMessages(prev => [...prev, { 
            role: 'ai', 
            text: suggestion.text,
            suggestions: relevantTools.length > 0 ? relevantTools.map(t => ({ id: t.id, name: t.name, description: t.description, category: t.category })) : undefined
          }]);
          return;
        }
      }

      if (lowerQuery.includes("secure") || lowerQuery.includes("safe") || lowerQuery.includes("data")) {
        setMessages(prev => [...prev, { role: 'ai', text: "Security is built-in. 95% of our apps process everything in your browser, so your sensitive data never leaves your device." }]);
        return;
      }

      if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("free")) {
        setMessages(prev => [...prev, { role: 'ai', text: "Luminix is—and will always be—100% free with no registration required for basic use. Just bookmark and learn!" }]);
        return;
      }

      // 4. Fallback: No clear match
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `I couldn't find a specific tool for "${userMessage}". Would you like me to find some helpful information online about this instead? I can also suggest exploring our 'Writing' or 'Math' categories.` 
      }]);
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 left-4 z-50 flex h-[70vh] flex-col overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 sm:left-auto sm:right-6 sm:h-[500px] sm:w-[350px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">Luminix AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-blue-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700'
                  }`}>
                    {msg.text}
                    {msg.suggestions && (
                      <div className="mt-3 space-y-2">
                        {msg.suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => {
                              navigate(`/tool/${suggestion.id}`);
                              setIsOpen(false);
                            }}
                            className="flex w-full flex-col rounded-xl bg-blue-50 dark:bg-slate-900/50 p-3 text-left transition-all hover:bg-blue-100 dark:hover:bg-blue-900/30 ring-1 ring-blue-100 dark:ring-blue-900/40 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-blue-900 dark:text-blue-200 text-xs italic">{suggestion.name}</span>
                              <ArrowRight className="h-3 w-3 text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="text-[11px] text-blue-700/80 dark:text-blue-300 mt-1 leading-relaxed">{suggestion.description}</p>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-300 dark:text-blue-800 mt-1">{suggestion.category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="flex items-center space-x-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2 ring-1 ring-slate-200 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-blue-600">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-white"
                />
                <button
                  onClick={handleSend}
                  disabled={!query.trim()}
                  className="rounded-lg bg-blue-600 p-1.5 text-white transition-opacity disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTutorial && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-24 right-4 left-4 z-50 rounded-[32px] bg-white dark:bg-slate-800 p-6 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 sm:left-auto sm:right-6 sm:w-72"
          >
            <div className="relative">
              <button 
                onClick={dismissTutorial}
                className="absolute -right-2 -top-2 rounded-full bg-slate-100 dark:bg-slate-700 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
              
              <div className="flex items-center space-x-2 text-blue-600">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-widest italic">Luminix Assist Active</span>
              </div>
              
              <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white leading-snug">
                Luminix AI is ready to help you learn faster! Describe your study topic.
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 opacity-80">
                  <div className="h-1 w-1 rounded-full bg-blue-500" />
                  <span>Ask Luminix about "Calculus"</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 opacity-80">
                  <div className="h-1 w-1 rounded-full bg-blue-500" />
                  <span>Explain "Photosynthesis"</span>
                </div>
              </div>

              <button
                onClick={() => {
                  dismissTutorial();
                  setIsOpen(true);
                }}
                className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:bg-blue-700 active:scale-95"
              >
                Try Luminix AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (showTutorial) dismissTutorial();
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
};
