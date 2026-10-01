import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { api } from '../services/api';
import { useUIStore } from '../store/useUIStore';

interface Idea {
  name: string;
  industry: string;
  target_audience: string;
  description: string;
}

interface AIIdeationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIdea: (idea: Idea) => void;
}

export const AIIdeationModal: React.FC<AIIdeationModalProps> = ({ isOpen, onClose, onSelectIdea }) => {
  const addToast = useUIStore(state => state.addToast);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setIdeas([]);
    try {
      const response = await api.getStartupSuggestions(prompt);
      if (response && response.ideas) {
        setIdeas(response.ideas);
      }
    } catch (error) {
      addToast('error', 'Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idea: Idea) => {
    onSelectIdea(idea);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-background border border-border/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">AI Ideation Wizard</h2>
                  <p className="text-sm text-muted-foreground">Describe a problem or general idea, and AI will give you 3 structured startup concepts.</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form onSubmit={handleGenerate} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    What's on your mind?
                  </label>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. I want to build a tool to help freelance graphic designers find clients automatically..."
                      className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm resize-none"
                      rows={3}
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || !prompt.trim()}
                      className="absolute right-3 bottom-3 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate
                    </button>
                  </div>
                </div>
              </form>

              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">Brainstorming startup ideas...</p>
                </div>
              )}

              {!loading && ideas.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Generated Concepts</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {ideas.map((idea, idx) => (
                      <m.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleSelect(idea)}
                        className="group relative p-5 rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/30 hover:border-purple-500/50 cursor-pointer transition-all shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-bold text-foreground group-hover:text-purple-500 transition-colors">{idea.name}</h4>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-muted rounded-md text-muted-foreground">{idea.industry}</span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">{idea.description}</p>
                            <p className="text-xs font-medium text-muted-foreground"><span className="opacity-70">Target:</span> {idea.target_audience}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors group-hover:border-purple-500">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </m.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};
