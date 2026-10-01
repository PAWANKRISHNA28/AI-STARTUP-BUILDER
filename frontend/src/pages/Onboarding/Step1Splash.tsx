import React from 'react';
import { m } from 'framer-motion';
import { Bot, ArrowRight } from 'lucide-react';

interface Step1SplashProps {
  onNext: () => void;
  onSkip: () => void;
}

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.95 }
};

export const Step1Splash: React.FC<Step1SplashProps> = ({ onNext, onSkip }) => {
  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-[24px] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#14B8A6] rounded-[20px] flex items-center justify-center mb-8 shadow-lg shadow-[#4F46E5]/20">
        <Bot size={40} className="text-white" />
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#3B82F6]">AI Startup Builder</span>
      </h1>
      
      <p className="text-lg text-[#6B7280] max-w-md mb-10 leading-relaxed">
        Transform Your Ideas Into Successful Startups with the power of intelligent AI agents working together.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button 
          onClick={onNext}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3.5 rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          Get Started
          <ArrowRight size={18} />
        </button>
        <button 
          onClick={onSkip}
          className="bg-gray-100 hover:bg-gray-200 text-[#374151] px-8 py-3.5 rounded-full font-medium transition-colors flex items-center justify-center"
        >
          Skip
        </button>
      </div>
    </m.div>
  );
};
