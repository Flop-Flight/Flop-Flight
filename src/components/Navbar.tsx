import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, Sparkles, Moon, Sun, LogOut, User as UserIcon, Settings as SettingsIcon, Zap, Brain, Rocket, Plus, History, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useAuth } from "../lib/AuthContext";
import { signInWithGoogle, logout, db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";

interface Thread {
  id: string;
  title: string;
  updatedAt: any;
}

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentThreadId: string | null;
  setCurrentThreadId: (id: string | null) => void;
}

export const Navbar = ({ theme, toggleTheme, currentThreadId, setCurrentThreadId }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeMode, setActiveMode] = useState({ name: "Luminix Flash", icon: Zap });

  useEffect(() => {
    if (!user || loading) {
        setThreads([]);
        return;
    }

    const threadsPath = `users/${user.uid}/threads`;
    const q = query(collection(db, threadsPath), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Thread[];
      setThreads(items);
    });

    return unsubscribe;
  }, [user]);

  const deleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    if (!user || !window.confirm("Delete this chat?")) return;
    try {
        await deleteDoc(doc(db, `users/${user.uid}/threads/${threadId}`));
        if (currentThreadId === threadId) setCurrentThreadId(null);
    } catch (e) { console.error(e); }
  };

  const renameThread = async (e: React.MouseEvent, threadId: string, currentTitle: string) => {
    e.stopPropagation();
    const newTitle = window.prompt("New title:", currentTitle);
    if (!user || !newTitle || newTitle === currentTitle) return;
    try {
        await updateDoc(doc(db, `users/${user.uid}/threads/${threadId}`), {
            title: newTitle,
            updatedAt: serverTimestamp()
        });
    } catch (e) { console.error(e); }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Left Section: Menu & Mode */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsModeOpen(!isModeOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <span className="text-xl font-medium text-slate-800 dark:text-slate-200">{activeMode.name}</span>
              <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isModeOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isModeOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl border border-slate-200 dark:border-slate-800"
                >
                  {[
                    { name: "Luminix Flash", icon: Zap, desc: "Fast & lightweight" },
                    { name: "Luminix Pro", icon: Brain, desc: "Advanced reasoning" },
                    { name: "Luminix Vision", icon: Rocket, desc: "Multimodal logic" },
                  ].map((mode) => (
                    <button
                      key={mode.name}
                      onClick={() => {
                        setActiveMode(mode);
                        setIsModeOpen(false);
                      }}
                      className="flex w-full items-center space-x-3 rounded-xl p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <mode.icon className={cn("h-5 w-5", activeMode.name === mode.name ? "text-blue-600" : "text-slate-400")} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{mode.name}</p>
                        <p className="text-[10px] text-slate-500">{mode.desc}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section: Theme & Auth */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {loading ? (
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
          ) : user ? (
            <div className="relative group/user">
              <button 
                className="flex items-center space-x-2 rounded-full p-0.5 pr-2 transition-all"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full shadow-sm" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl border border-slate-200 dark:border-slate-800 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.displayName || user.email}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex w-full items-center space-x-3 rounded-xl p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-medium"
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>Account</span>
                </button>
                <button
                  onClick={() => { logout(); }}
                  className="flex w-full items-center space-x-3 rounded-xl p-3 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-xs font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[300px] bg-[#f0f4f9] dark:bg-slate-900 shadow-2xl z-[120] p-4 pt-20 flex flex-col"
            >
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <button 
                  onClick={() => { setCurrentThreadId(null); navigate("/"); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-4 p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>New chat</span>
                </button>

                <div className="mt-8 space-y-1">
                   <button className="w-full flex items-center space-x-4 p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-400">
                    <History className="h-5 w-5" />
                    <span>My stuff</span>
                  </button>
                </div>
                
                <div className="mt-10">
                  <h2 className="px-4 text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Recent</h2>
                  <div className="space-y-1">
                    {threads.length === 0 ? (
                        <p className="px-12 text-xs text-slate-400 italic">No recent chats yet</p>
                    ) : (
                        threads.map(thread => (
                            <div 
                                key={thread.id}
                                onClick={() => { setCurrentThreadId(thread.id); setIsMenuOpen(false); navigate('/'); }}
                                className={cn(
                                    "group relative w-full flex items-center space-x-3 p-3 rounded-full transition-all cursor-pointer",
                                    currentThreadId === thread.id 
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                                    : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                )}
                            >
                                <MessageSquare className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-sm truncate font-medium">{thread.title}</span>
                                
                                <div className="absolute right-3 opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                                    <button 
                                        onClick={(e) => renameThread(e, thread.id, thread.title)}
                                        className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-300 dark:hover:bg-slate-700"
                                    >
                                        <Edit2 className="h-3 w-3" />
                                    </button>
                                    <button 
                                        onClick={(e) => deleteThread(e, thread.id)}
                                        className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1">
                 <button 
                  onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-4 p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-400"
                 >
                    <SettingsIcon className="h-5 w-5" />
                    <span>Settings & help</span>
                  </button>
                  
                  <div className="mt-4 p-4 rounded-3xl bg-slate-200/50 dark:bg-slate-800/50">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 mb-2">
                       <Sparkles className="h-4 w-4" />
                       <span className="text-xs font-bold uppercase tracking-widest">Luminix Intelligence</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Advanced academic assistant powered by neural engines.</p>
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
