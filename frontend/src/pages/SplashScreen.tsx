import React, { useEffect } from 'react';
import { m } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const SplashScreen: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [setCurrentPage]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-8">
          <m.div
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(79, 70, 229, 0.4)', '0 0 0 20px rgba(79, 70, 229, 0)', '0 0 0 0 rgba(79, 70, 229, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-soft"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </m.div>
        </div>

        <m.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-display font-bold text-heading mb-4 text-center"
        >
          AI Startup Builder
        </m.h1>
        
        <m.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-body text-center max-w-sm"
        >
          "Transform Ideas into Investor-Ready Startups"
        </m.p>
        
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <m.div
              key={i}
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-primary rounded-full"
            />
          ))}
        </m.div>
      </m.div>
    </div>
  );
};
