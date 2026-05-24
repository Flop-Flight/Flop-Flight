import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, MessageCircle, AlertCircle, Sparkles } from "lucide-react";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
    const [type, setType] = useState<"suggestion" | "bug" | "praise">("suggestion");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Since we don't have a backend, we simulate submission
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setMessage("");
            onClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-blue-600 p-6 text-white text-center">
                            <button 
                                onClick={onClose}
                                className="absolute right-6 top-6 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <MessageCircle className="mx-auto h-12 w-12 opacity-80 mb-4" />
                            <h2 className="text-2xl font-black italic">Share your feedback</h2>
                            <p className="text-blue-100 text-sm mt-1">Help us make Luminix better for everyone.</p>
                        </div>

                        <div className="p-8">
                            {submitted ? (
                                <div className="text-center py-10 space-y-4">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                        <Send className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Thank You!</h3>
                                    <p className="text-slate-500 italic text-sm">Your feedback has been received and processed.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex gap-2">
                                        {(["suggestion", "bug", "praise"] as const).map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={`flex-1 rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                                                    type === t 
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                                    : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center gap-1">
                                                    {t === "suggestion" && <Sparkles className="h-4 w-4" />}
                                                    {t === "bug" && <AlertCircle className="h-4 w-4" />}
                                                    {t === "praise" && <MessageCircle className="h-4 w-4" />}
                                                    {t}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
                                        <textarea
                                            required
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={
                                                type === "bug" 
                                                ? "Describe the issue..." 
                                                : type === "suggestion" 
                                                ? "What feature should we add next?" 
                                                : "Tell us what you love!"
                                            }
                                            className="h-32 w-full resize-none rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-2xl bg-blue-600 py-4 font-black transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 text-white active:scale-[0.98]"
                                    >
                                        Send Feedback
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
