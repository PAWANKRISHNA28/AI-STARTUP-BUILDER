import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, BrainCircuit, Bot, Cpu, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import clsx from 'clsx';

interface Step4AIModelProps {
  onNext: () => void;
  onBack: () => void;
}

const models = [
  { id: 'auto', title: 'Auto Select', desc: 'Best model for each specific task', icon: Zap },
  { id: 'gpt4', title: 'OpenAI GPT', desc: 'Powerful reasoning and coding', icon: Sparkles },
  { id: 'gemini', title: 'Google Gemini', desc: 'Fast, multimodal intelligence', icon: BrainCircuit },
  { id: 'claude', title: 'Claude', desc: 'Nuanced writing and long context', icon: Bot },
  { id: 'local', title: 'Local LLM', desc: 'Maximum privacy and control', icon: Cpu },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const Step4AIModel: React.FC<Step4AIModelProps> = ({ onNext, onBack }) => {
  const user = useAuthStore(state => state.user);
  const updateUserPreferences = useAuthStore(state => state.updateUserPreferences);
  const [selectedModel, setSelectedModel] = useState<string>(user?.aiPreference || 'auto');

  const handleNext = () => {
    updateUserPreferences({ aiPreference: selectedModel });
    onNext();
  };

  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">Preferred AI Model</h2>
        <p className="text-[#6B7280]">Select the primary AI brain for your startup. You can change this later.</p>
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {models.map((model) => {
          const Icon = model.icon;
          const isSelected = selectedModel === model.id;
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={clsx(
                "flex items-center p-4 rounded-2xl border transition-all duration-200 text-left",
                isSelected 
                  ? "border-[#4F46E5] bg-[#4F46E5]/5 shadow-[0_0_0_1px_#4F46E5]" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white"
              )}
            >
              <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center mr-4",
                isSelected ? "bg-[#4F46E5] text-white" : "bg-gray-100 text-gray-500"
              )}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className={clsx("font-semibold", isSelected ? "text-[#4F46E5]" : "text-[#111827]")}>
                  {model.title}
                </h3>
                <p className="text-sm text-gray-500">{model.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <button 
          onClick={onBack}
          className="text-[#6B7280] hover:text-[#111827] px-4 py-2 font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button 
          onClick={handleNext}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </m.div>
  );
};
