import { useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, Shield, Globe, Award, MessageSquare, Sparkles } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

export const Footer = () => {
    const year = new Date().getFullYear();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 pb-8 transition-colors">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition-transform group-hover:scale-110">
                                <Sparkles className="h-5 w-5 animate-pulse text-blue-400" />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Luminix</span>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Official intelligence platform of the Luminix study ecosystem. Empowering students with 30+ productivity tools.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Platform</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Browse Tools</Link></li>
                            <li><Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400">Help & FAQ</Link></li>
                            <li><Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Company Blog</Link></li>
                            <li>
                                <a href="mailto:aryantiwari56541@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400">Business Enquiry</a>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setIsFeedbackOpen(true)}
                                    className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    <MessageSquare className="h-3 w-3" />
                                    <span>Send Feedback</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Security</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-emerald-500" />
                                <span>Encrypted processing</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-blue-500" />
                                <span>Global availability</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-2xl bg-blue-50 dark:bg-slate-800 p-6">
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                            <Award className="h-5 w-5" />
                            <span className="font-bold">Verified Luminix AI</span>
                        </div>
                        <p className="mt-2 text-xs text-blue-600/80 dark:text-blue-400/80">
                            All tools are tested for precision and speed.
                        </p>
                    </div>
                </div>

                <div className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            &copy; {year} Luminix Platform. All rights reserved. Official Neural Intelligence core version 3.0.
                        </p>
                        <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                            Trust Score: 99.9% | Serving 15k+ Users Daily
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                         <Link to="/privacy" className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white">Privacy</Link>
                         <Link to="/terms" className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white">Terms</Link>
                         <div className="text-xs font-black text-slate-200 dark:text-slate-800">#LUMINIX-ORIGINAL</div>
                    </div>
                </div>
            </div>
            <FeedbackModal 
                isOpen={isFeedbackOpen} 
                onClose={() => setIsFeedbackOpen(false)} 
            />
        </footer>
    );
};
