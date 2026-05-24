import { motion } from "motion/react";
import { Sparkles, GraduationCap } from "lucide-react";
import { LuminixChat } from "../components/LuminixChat";

export const Home = ({ currentThreadId, setCurrentThreadId }: { currentThreadId: string | null, setCurrentThreadId: (id: string | null) => void }) => {
  return (
    <div className="min-h-screen moving-gradient transition-colors overflow-hidden">
      <main className="relative h-screen flex flex-col items-center">
        <LuminixChat currentThreadId={currentThreadId} setCurrentThreadId={setCurrentThreadId} />
      </main>
    </div>
  );
};
