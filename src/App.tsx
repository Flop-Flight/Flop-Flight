/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { ToolView } from "./pages/ToolView";
import { Admin } from "./pages/Admin";
import { BlogFaq } from "./pages/BlogFaq";
import { TermsPrivacy } from "./pages/TermsPrivacy";
import { Settings } from "./pages/Settings";

const AppContent = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} currentThreadId={currentThreadId} setCurrentThreadId={setCurrentThreadId} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home currentThreadId={currentThreadId} setCurrentThreadId={setCurrentThreadId} />} />
          <Route path="/tool/:id" element={<ToolView />} />
          <Route path="/toolo-admin-18" element={<Admin />} />
          <Route path="/blog" element={<BlogFaq />} />
          <Route path="/faq" element={<BlogFaq />} />
          <Route path="/privacy" element={<TermsPrivacy />} />
          <Route path="/terms" element={<TermsPrivacy />} />
          <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
        </Routes>
      </main>
      {!isHome && <Footer />}
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent theme={theme} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </AuthProvider>
  );
}
