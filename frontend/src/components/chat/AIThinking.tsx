import React from 'react';
import { m } from 'framer-motion';
import { CheckCircle2, Loader2, Cpu } from 'lucide-react';

interface AIThinkingProps {
  agents: { name: string; status: 'completed' | 'running' | 'pending' }[];
  message?: string;
}

export const AIThinking: React.FC<AIThinkingProps> = ({ agents, message = 'Processing Neural Data...' }) => {
  return (
    <m.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="glass-panel bg-white/40 border border-white/40 backdrop-blur-2xl rounded-[28px] p-6 my-4 w-full max-w-md shadow-2xl relative overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <m.div 
        animate={{ 
          background: [
            'radial-gradient(circle at 0% 0%, rgba(79,140,255,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(139,92,246,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(79,140,255,0.15) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        {/* Holographic AI Core */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <m.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-t-primary border-r-transparent border-b-secondary border-l-transparent"
          />
          <m.div 
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-1 rounded-full border border-t-secondary border-r-transparent border-b-primary border-l-transparent opacity-60"
          />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(79,140,255,0.5)]">
            <Cpu className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-foreground text-base tracking-tight">AI Core Active</h4>
          <p className="text-xs text-muted-foreground font-medium">{message}</p>
        </div>
      </div>
      
      <div className="space-y-3 relative z-10">
        {agents.map((agent, idx) => (
          <m.div 
            key={idx} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-2 rounded-xl bg-white/40 border border-white/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              {agent.status === 'completed' && (
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
              )}
              {agent.status === 'running' && (
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center relative">
                  <m.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
              {agent.status === 'pending' && (
                <div className="w-6 h-6 rounded-full bg-muted/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                </div>
              )}
              <span className={`font-semibold text-sm ${agent.status === 'completed' ? 'text-foreground' : agent.status === 'running' ? 'text-primary' : 'text-muted-foreground'}`}>
                {agent.name}
              </span>
            </div>
            
            {agent.status === 'running' && (
              <span className="text-[10px] uppercase font-bold text-primary tracking-widest animate-pulse">
                Processing
              </span>
            )}
          </m.div>
        ))}
      </div>
    </m.div>
  );
};
