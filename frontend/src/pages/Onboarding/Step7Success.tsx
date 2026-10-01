import React, { useEffect } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Step7SuccessProps {
  onComplete: () => void;
}

const pageVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.1 }
};

export const Step7Success: React.FC<Step7SuccessProps> = ({ onComplete }) => {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-[24px] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center"
    >
      <m.div 
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        className="w-24 h-24 bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-full flex items-center justify-center mb-8 shadow-lg shadow-[#14B8A6]/20"
      >
        <Sparkles size={48} className="text-white" />
      </m.div>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
        You're Ready!
      </h1>
      
      <p className="text-lg text-[#6B7280] max-w-md mb-10 leading-relaxed">
        Your workspace is completely set up. Let's start building your next great idea.
      </p>

      <button 
        onClick={onComplete}
        className="bg-[#111827] hover:bg-[#1F2937] text-white px-10 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md w-full sm:w-auto"
      >
        Go to Dashboard
        <ArrowRight size={20} />
      </button>
    </m.div>
  );
};
