import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Moon, Sun, Trash2, Shield, ChevronRight, CheckCircle2, Sparkles, LogOut, Info } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { db, auth } from "../lib/firebase";
import { doc, updateDoc, collection, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Settings = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          setDisplayName(userSnap.data().displayName || user.displayName || "");
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName
      });
      setMessage({ type: 'success', text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: 'error', text: "Failed to update profile." });
    } finally {
        setIsLoading(false);
        setTimeout(() => setMessage(null), 3000);
    }
  };

  const clearHistory = async () => {
    if (!user || !window.confirm("Are you sure you want to delete all your chat history? This cannot be undone.")) return;
    
    setIsLoading(true);
    try {
      // Clear main chat
      const chatSnap = await getDocs(collection(db, "users", user.uid, "chats"));
      chatSnap.forEach(async (d) => await deleteDoc(d.ref));
      
      // Clear academic history
      const historySnap = await getDocs(collection(db, "users", user.uid, "history"));
      historySnap.forEach(async (d) => await deleteDoc(d.ref));

      setMessage({ type: 'success', text: "All history cleared." });
    } catch (error) {
      setMessage({ type: 'error', text: "Error clearing history." });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] dark:bg-slate-950 pt-32 pb-20 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase transition-colors">Settings & Help</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Manage your Luminix experience and privacy.</p>
        </header>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 ${
                message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
            }`}
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-bold">{message.text}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Section: Profile */}
          <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center space-x-3 mb-8">
               <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <User className="h-5 w-5" />
               </div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Profile Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Display Name</label>
                <div className="relative">
                    <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="Enter your name"
                    />
                    <button 
                        onClick={handleUpdateProfile}
                        disabled={isLoading}
                        className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Gmail Account</label>
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-colors">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{user?.email || "Not linked"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Credits & Author */}
          <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                    <Info className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Application Credits</h2>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Developer & Author</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Aryan Tiwari</p>
                <p className="text-xs text-slate-500 mt-1">Lead Architect & Neural Engineer</p>
            </div>
          </section>

          {/* Section: Appearance */}
          <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                        {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Appearance</h2>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="px-6 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                >
                  Switch to {theme === 'light' ? 'Dark' : 'Light'}
                </button>
            </div>
          </section>

          {/* Section: AI Engine */}
          <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Neural Engine</h2>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Core Model</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Gemini 1.5 Flash</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Response Quality</span>
                    <span className="text-sm font-bold text-emerald-600">High Resolution</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Context Window</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">1M Tokens</span>
                </div>
            </div>
          </section>

          {/* Section: Privacy */}
          <section className="bg-red-50 dark:bg-red-950/20 rounded-[32px] p-8 border border-red-100 dark:border-red-900/30 transition-colors">
             <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-red-600 shadow-sm transition-colors">
                    <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-red-900 dark:text-red-100 transition-colors">Privacy & Data</h2>
            </div>
            
            <p className="text-sm text-red-700 dark:text-red-300/70 mb-8 max-w-lg transition-colors">
                Your data is stored securely using industry-standard encryption. You have full control over your conversation history.
            </p>

            <div className="flex flex-col space-y-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-3 p-5 rounded-[30px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl dark:shadow-none"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>

              <button 
                onClick={clearHistory}
                disabled={isLoading}
                className="group flex items-center justify-center space-x-3 text-red-600 font-black uppercase tracking-widest text-[10px] hover:text-red-700 transition-colors p-4 rounded-3xl border-2 border-dashed border-red-200 dark:border-red-900/30"
              >
                <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Delete All Chat History</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
